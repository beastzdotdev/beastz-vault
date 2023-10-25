import { inject } from 'inversify';
import { toast } from '../../../shared/toast';
import { AuthApiService } from '../../../shared/api';
import { router } from '../../../shared/router';
import { ExceptionMessageCode } from '../../../models/enum/exception-message-code.enum';
import { constants } from '../../../shared/constants';
import { Singleton } from '../../../shared/decorators';

@Singleton
export class AuthController {
  @inject(AuthApiService)
  private readonly authApiService: AuthApiService;

  async demoSignIn() {
    await this.signIn({ email: 'demo@gmail.com', password: 'jsbyangtjt37*', isDemo: true });
  }

  async signIn(params: { email: string; password: string; isDemo?: boolean }) {
    const { email, password, isDemo } = params;
    const { error, data } = await this.authApiService.signIn({ email, password });

    if (error) {
      if (error.message === ExceptionMessageCode.USER_NOT_VERIFIED) {
        router.navigate(constants.path.authVerify);
        return;
      }

      if (isDemo) {
        toast.error('Demo user does not exist');
      } else {
        toast.error('Email or password incorrect');
      }
    }

    if (data) {
      router.navigate('/');
    }
  }

  async signUp(params: {
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    gender: string;
    password: string;
  }) {
    const { error, data } = await this.authApiService.signUp(params);

    if (error) {
      if (error.message === ExceptionMessageCode.USER_EMAIL_EXISTS) {
        toast.error('User email already exists');
        return;
      }

      toast.error('Error on sign up');
    }

    if (data && data.isAccountVerified) {
      router.navigate('/');
    } else {
      router.navigate(constants.path.authVerifyMessage);
    }
  }

  async accountVerify(params: { email: string }) {
    const { error } = await this.authApiService.verify(params);

    if (error) {
      if (error.message === ExceptionMessageCode.USER_EMAIL_EXISTS) {
        toast.error('User email already exists');
        return;
      }
      if (error.message === ExceptionMessageCode.USER_NOT_FOUND) {
        toast.error('User not found');
        return;
      }

      toast.error('Error on verify');
    }
  }
}
