import { inject } from 'inversify';
import { Singleton } from '../../../app/ioc';
import { toast } from '../../../helper/toast';
import { AuthApiService } from '../../../shared/api';
import { router } from '../../../router';

@Singleton
export class AuthController {
  @inject(AuthApiService)
  private readonly authApiService: AuthApiService;

  async demoSignIn() {
    await this.signIn({
      email: 'demo@gmail.com',
      password: 'jsbyangtjt37*',
      isDemo: true,
    });
  }

  async signIn(params: { email: string; password: string; isDemo?: boolean }) {
    const { email, password, isDemo } = params;

    const { error, success } = await this.authApiService.signIn({ email, password });

    if (error) {
      if (isDemo) {
        toast.error('Demo user does not exist');
      } else {
        toast.error('Email or password incorrect');
      }
    }

    if (success) {
      router.navigate('/');
    }
  }
}
