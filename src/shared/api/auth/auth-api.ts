import { AxiosError, AxiosResponse } from 'axios';
import { Singleton } from '../../../app/ioc';
import { api } from '..';
import { ExceptionSchema } from '../../../models/exception.schema';
import { AxiosApiResponse } from '../../../models/general';
import { ExceptionMessageCode } from '../../../models/enum/exception-message-code.enum';
import { SignInResponse } from './auth-api-schema';

@Singleton
export class AuthApiService {
  async signIn(params: {
    email: string;
    password: string;
  }): Promise<AxiosApiResponse<SignInResponse>> {
    try {
      const result: AxiosResponse = await api.post('auth/sign-in', params);

      return {
        success: { data: result.data },
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        const responseBody = error.response?.data;
        const exceptionBody = await ExceptionSchema.passthrough().safeParseAsync(responseBody);

        if (exceptionBody.success) {
          return {
            error: exceptionBody.data,
          };
        }
      }

      return {
        error: {
          code: ExceptionMessageCode.CLIENT_OR_INTERNAL_ERROR,
          status: 500,
        },
      };
    }
  }
}
