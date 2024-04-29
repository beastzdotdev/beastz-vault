import axios, { AxiosError, CreateAxiosDefaults, HttpStatusCode } from 'axios';
import { constants } from '../constants';
import { bus } from '../bus/bus';
import { router } from '../../router';
import { ExceptionSchema } from '../errors/exception.schema';
import { ExceptionMessageCode } from '../enum/exception-message-code.enum';
import { ClientApiError } from '../errors/client-error.schema';
import { HandleRefreshType } from '../types';
import { cleanURL } from '../helper';
import { errNetworkText } from '../../features/auth/oops.page';

const axiosConfigs: CreateAxiosDefaults = {
  baseURL: constants.path.backend.url,
  headers: { platform: 'WEB' },
  withCredentials: true,
};

export const apiPure = axios.create(axiosConfigs); // this does not have anything like interceptor, handlers, ...
export const api = axios.create(axiosConfigs);

api.interceptors.response.use(r => r, handleAxiosResponseError);

// needs to be like this
let refreshingFunc: Promise<HandleRefreshType> | undefined;

/**
 * @description when status is forbidden then post refresh and get new access/refresh tokens
 *              and restart last api request, if refresh has any type of problem we do not care
 *              it should not happen if everything is correctly done
 */
async function handleAxiosResponseError(error: unknown) {
  const generalClientError = new ClientApiError(
    HttpStatusCode.InternalServerError,
    ExceptionMessageCode.CLIENT_OR_INTERNAL_ERROR,
    error
  );

  try {
    if (error instanceof AxiosError) {
      const originalConfig = error.config;
      let responseBody = error.response?.data;

      if (responseBody instanceof Blob) {
        responseBody = JSON.parse(await responseBody.text());
      }

      const exceptionBody = await ExceptionSchema.passthrough().safeParseAsync(responseBody);

      // this should not happen, router.navigate to oops
      if (!originalConfig) {
        window.location.href = cleanURL(constants.path.oops).toString();

        return Promise.reject(
          new ClientApiError(
            HttpStatusCode.InternalServerError,
            ExceptionMessageCode.CLIENT_OR_INTERNAL_ERROR,
            error
          )
        );
      }

      if (exceptionBody.success) {
        const needsRefresh =
          exceptionBody.data.message === ExceptionMessageCode.ACCESS_EXPIRED_TOKEN &&
          exceptionBody.data.statusCode === HttpStatusCode.Unauthorized;

        const clientAPiError = new ClientApiError(
          exceptionBody.data.statusCode,
          exceptionBody.data.message,
          error
        );

        if (needsRefresh) {
          // const data = await handleRefresh();
          if (!refreshingFunc) refreshingFunc = handleRefresh();

          const data = await refreshingFunc;

          // refresh token unsuccessfull
          if (!data.success) {
            // show alert and redirect
            handleUserExceptionsInRefresh(data.message);
            return Promise.reject(clientAPiError);
          }

          // refresh was successfull, retry original request
          return await api.request(originalConfig);
        }

        // here if refresh was not needed but returned error
        handleUserExceptionsInAccess(exceptionBody.data.message);
        return Promise.reject(clientAPiError);
      }

      if (error.code === AxiosError.ERR_NETWORK) {
        // hard refresh on network err
        window.location.href = cleanURL(constants.path.oops, { text: errNetworkText }).toString();
        return Promise.reject(generalClientError);
      }
    }

    // unknown error, navigate to oops
    window.location.href = cleanURL(constants.path.oops).toString();
    return Promise.reject(generalClientError);
  } catch (error) {
    console.log(error);
  } finally {
    refreshingFunc = undefined;
  }
}

/**
 * @description handle refresh call everything must go smoothly. any type of problem must
 *              be met with localstorage clear and redirect to sign in page
 */
async function handleRefresh(): Promise<HandleRefreshType> {
  try {
    await apiPure.post<void>('auth/refresh');
    return { success: true };
  } catch (error) {
    if (error instanceof AxiosError) {
      return { success: false, message: error.response?.data?.message };
    }

    return { success: false };
  }
}

// this handler is only for this file and this api instance

/**
 * @description handler is only for this file and this api instance and only for refresh exception
 */
function handleUserExceptionsInRefresh(message?: ExceptionMessageCode) {
  // if message is not returned this will pop up, unexpected
  if (!message) {
    bus.emit('show-alert', {
      message: 'Something unexpected happend, message was not given',
      onClose: () => router.navigate(constants.path.signIn),
    });
    return;
  }

  switch (message) {
    case ExceptionMessageCode.USER_NOT_VERIFIED:
      bus.emit('show-alert', {
        message: 'User not verified',
        onClose: () => router.navigate(constants.path.authUserNotVerified),
      });
      break;
    case ExceptionMessageCode.USER_BLOCKED:
      bus.emit('show-alert', {
        message: 'User is blocked, please contact our support',
        onClose: () => router.navigate(constants.path.authUserBlocked),
      });
      break;
    case ExceptionMessageCode.USER_LOCKED:
      bus.emit('show-alert', {
        message: 'User is locked, please verify account again',
        onClose: () => router.navigate(constants.path.authUserLocked),
      });
      break;
    default:
      // session expiration, or something happend with token, or missing
      bus.emit('show-alert', {
        message: 'Session expired',
        onClose: () => router.navigate(constants.path.authUserNotVerified),
      });
      break;
  }
}

/**
 * @description handler is only for this file and this api instance and only for accesss exception
 */
function handleUserExceptionsInAccess(message?: ExceptionMessageCode) {
  // if message is not returned this will pop up, unexpected
  if (!message) {
    bus.emit('show-alert', {
      message: 'Something unexpected happend, message was not given',
      onClose: () => router.navigate(constants.path.signIn),
    });
    return;
  }

  // is token expired than just get out
  if (message === ExceptionMessageCode.ACCESS_EXPIRED_TOKEN) {
    return;
  }

  // just check block, lock and not verified
  switch (message) {
    case ExceptionMessageCode.USER_NOT_VERIFIED:
      bus.emit('show-alert', {
        message: 'User not verified',
        onClose: () => router.navigate(constants.path.authUserNotVerified),
      });
      break;
    case ExceptionMessageCode.USER_BLOCKED:
      bus.emit('show-alert', {
        message: 'User is blocked, please contact our support',
        onClose: () => router.navigate(constants.path.authUserBlocked),
      });
      break;
    case ExceptionMessageCode.USER_LOCKED:
      bus.emit('show-alert', {
        message: 'User is locked, please verify account again',
        onClose: () => router.navigate(constants.path.authUserLocked),
      });
      break;
    case ExceptionMessageCode.MISSING_TOKEN:
    case ExceptionMessageCode.INVALID_TOKEN:
      router.navigate(constants.path.signIn);
      break;
  }
}
