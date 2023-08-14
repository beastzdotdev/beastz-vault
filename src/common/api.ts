import axios, { AxiosError, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
import { constants } from './constants';
import { redirect } from '../helper';

class AuthRespDto {
  accessToken: string;
  refreshToken: string;
  hasEmailVerified?: boolean;
}

const axiosConfigs: CreateAxiosDefaults = {
  baseURL: constants.path.backend,
  headers: { platform: 'WEB' },
  withCredentials: false,
};

export const apiWithoutAuth = axios.create(axiosConfigs);
export const api = axios.create(axiosConfigs);

api.interceptors.request.use(handleAxiosRequest, e => Promise.reject(e));
api.interceptors.response.use(r => r, handleAxiosResponseError);

/**
 * @description refresh token is only checked not sent every time
 *              access token is added after validation on every request
 */
function handleAxiosRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const accessToken = localStorage.getItem(constants.names.localStorageAccessToken);
  const refreshToken = localStorage.getItem(constants.names.localStorageRefreshToken);

  if (!accessToken || !refreshToken) {
    localStorage.clear();
    redirect(constants.path.signIn);
    return config;
  }

  // add only access token
  config.headers['Authorization'] = `Bearer ${accessToken}`;
  return config;
}

let refreshingFunc: Promise<AuthRespDto | null> | undefined = undefined;
/**
 * @description when status is forbidden then post refresh and get new access/refresh tokens
 *              and restart last api request, if refresh has any type of problem we do not care
 *              it should not happen if everything is correctly done
 */
async function handleAxiosResponseError(error: unknown) {
  if (error instanceof AxiosError) {
    const originalConfig = error.config;
    const needsRefresh =
      error.response?.status === constants.statusCodes.FORBIDDEN &&
      originalConfig &&
      error.response;

    try {
      if (needsRefresh) {
        if (!refreshingFunc) refreshingFunc = handleRefresh();

        const data = await refreshingFunc;

        console.log(data);

        if (!data) return Promise.reject(error);

        localStorage.setItem(constants.names.localStorageAccessToken, data.accessToken);
        localStorage.setItem(constants.names.localStorageRefreshToken, data.refreshToken);
        originalConfig.headers.Authorization = `Bearer ${data.accessToken}`;

        // retry original request
        try {
          return await api.request(originalConfig);
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error) {
      localStorage.removeItem(constants.names.localStorageAccessToken);
      localStorage.removeItem(constants.names.localStorageRefreshToken);
    } finally {
      refreshingFunc = undefined;
    }
  }

  return Promise.reject(error);
}

/**
 * @description handle refresh call everything must go smoothly. any type of problem must
 *              be met with localstorage clear and redirect to sign in page
 */
async function handleRefresh() {
  const refreshToken = localStorage.getItem(constants.names.localStorageRefreshToken);

  if (!refreshToken) {
    return null;
  }

  try {
    const { data } = await apiWithoutAuth.post<AuthRespDto>('authentication/refresh', {
      refreshToken,
    });

    return data;
  } catch (error) {
    return null;
  }
}
