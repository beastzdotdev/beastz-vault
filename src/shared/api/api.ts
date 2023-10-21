import axios, { AxiosError, CreateAxiosDefaults } from 'axios';
import { constants } from '../constants';
import { ExceptionSchema } from '../../models/exception.schema';
import { ExceptionMessageCode } from '../../models/enum/exception-message-code.enum';
import { bus } from '../../bus';

class AuthRespDto {
  accessToken: string;
}

const axiosConfigs: CreateAxiosDefaults = {
  baseURL: constants.path.backend,
  headers: { platform: 'WEB' },
  withCredentials: true,
};

export const apiWithoutAuth = axios.create(axiosConfigs);
export const api = axios.create(axiosConfigs);

api.interceptors.response.use(r => r, handleAxiosResponseError);

let refreshingFunc: Promise<AuthRespDto | null> | undefined = undefined;
/**
 * @description when status is forbidden then post refresh and get new access/refresh tokens
 *              and restart last api request, if refresh has any type of problem we do not care
 *              it should not happen if everything is correctly done
 */
async function handleAxiosResponseError(error: unknown) {
  if (error instanceof AxiosError) {
    const originalConfig = error.config;
    const responseBody = error.response?.data;

    const exceptionBody = await ExceptionSchema.passthrough().safeParseAsync(responseBody);

    // console.log(123);
    // console.log('='.repeat(20));
    // console.log(responseBody);
    // console.log(exceptionBody);

    if (exceptionBody.success && originalConfig) {
      const needsRefresh =
        exceptionBody.data.code === ExceptionMessageCode.ACCESS_EXPIRED_TOKEN &&
        exceptionBody.data.status === constants.statusCodes.UNAUTHORIZED;

      try {
        if (needsRefresh) {
          if (!refreshingFunc) refreshingFunc = handleRefresh();

          const data = await refreshingFunc;

          if (!data) {
            return Promise.reject(error);
          }

          // retry original request
          return await api.request(originalConfig);
        }
      } catch (error) {
        console.log(error);
      } finally {
        refreshingFunc = undefined;
      }
    }
  }

  return Promise.reject(error);
}

/**
 * @description handle refresh call everything must go smoothly. any type of problem must
 *              be met with localstorage clear and redirect to sign in page
 */
async function handleRefresh() {
  try {
    const { data } = await apiWithoutAuth.post<AuthRespDto>('auth/refresh');

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const responseBody = error.response?.data;
      const exceptionBody = ExceptionSchema.safeParse(responseBody);

      // this is exception thrown from backend api and also exception made for front end
      if (responseBody && exceptionBody.success) {
        //TODO check reuse also
        if (exceptionBody.data.code === ExceptionMessageCode.REFRESH_EXPIRED_TOKEN) {
          bus.emit('show-alert', 'Session expired');
        }
      }
    }

    console.log(error);
    return null;
  }
}
