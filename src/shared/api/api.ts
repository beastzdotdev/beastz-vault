import axios, { AxiosError, CreateAxiosDefaults, HttpStatusCode } from 'axios';
import { constants } from '../constants';
import { ExceptionSchema } from '../../models/exception.schema';
import { ExceptionMessageCode } from '../../models/enum/exception-message-code.enum';
import { ClientApiError } from '../../models/client-error.schema';
import { handleUserExceptions } from '../helper';

const axiosConfigs: CreateAxiosDefaults = {
  baseURL: constants.path.backend.url,
  headers: { platform: 'WEB' },
  withCredentials: true,
};

export const apiWithoutAuth = axios.create(axiosConfigs);
export const api = axios.create(axiosConfigs);

api.interceptors.response.use(r => r, handleAxiosResponseError);

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

    if (exceptionBody.success && originalConfig) {
      const needsRefresh =
        exceptionBody.data.message === ExceptionMessageCode.ACCESS_EXPIRED_TOKEN &&
        exceptionBody.data.statusCode === HttpStatusCode.Unauthorized;

      const clientAPiError = new ClientApiError(
        exceptionBody.data.statusCode,
        exceptionBody.data.message,
        error
      );

      if (needsRefresh) {
        const data = await handleRefresh();

        if (!data.success) {
          // show alert and redirect
          await handleUserExceptions(data.message);

          return Promise.reject(clientAPiError);
        }

        // retry original request
        return await api.request(originalConfig);
      }

      return Promise.reject(clientAPiError);
    }
  }

  return Promise.reject(
    new ClientApiError(
      HttpStatusCode.InternalServerError,
      ExceptionMessageCode.CLIENT_OR_INTERNAL_ERROR,
      error
    )
  );
}

/**
 * @description handle refresh call everything must go smoothly. any type of problem must
 *              be met with localstorage clear and redirect to sign in page
 */
async function handleRefresh(): Promise<{ success: boolean; message?: ExceptionMessageCode }> {
  try {
    await apiWithoutAuth.post<void>('auth/refresh');
    return { success: true };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { success: false, message: error.response?.data?.message };
    }

    return { success: false };
  }
}
