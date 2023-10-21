import { inject } from 'inversify';
import { Singleton } from '../../../app/ioc';
import { toast } from '../../../helper/toast';
import { AuthApiService } from '../../../shared/api';

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

    try {
      console.log('='.repeat(20));
      console.log(params);

      await this.authApiService.signIn({ email, password });

      // router.navigate('/');
    } catch (e: unknown) {
      if (isDemo) {
        toast.error('Demo user does not exist');
      } else {
        toast.error('Email or password incorrect');
      }
    }
  }
}
