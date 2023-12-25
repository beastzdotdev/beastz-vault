import { router } from '../../../router';
import {
  Singleton,
  Inject,
  AuthApiService,
  ExceptionMessageCode,
  constants,
  toast,
  bus,
} from '../../../shared';

@Singleton
export class AuthController {
  @Inject(AuthApiService)
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
      bus.emit('show-alert', { message: 'We have sent you account verification on you email' });
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
