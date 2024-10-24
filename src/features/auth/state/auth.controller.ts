import { router } from "../../../router";
import { AuthApiService } from "../../../shared/api";
import { bus } from "../../../shared/bus";
import { constants } from "../../../shared/constants";
import { ExceptionMessageCode } from "../../../shared/enum";
import { openLinkSelf } from "../../../shared/helper";
import { Singleton, Inject } from "../../../shared/ioc";
import { toast } from "../../../shared/ui";

@Singleton
export class AuthController {
  @Inject(AuthApiService)
  private readonly authApiService: AuthApiService;

  async demoSignIn() {
    await this.signIn({
      email: "demo@demo.com",
      password: "demo123@",
      isDemo: true,
    });
  }

  async signIn(params: { email: string; password: string; isDemo?: boolean }) {
    const { email, password, isDemo } = params;
    const { error, data } = await this.authApiService.signIn({
      email,
      password,
    });

    if (error) {
      if (error.message === ExceptionMessageCode.USER_NOT_VERIFIED) {
        router.navigate(constants.path.authVerify);
        return;
      }

      if (isDemo) {
        toast.error("Demo user does not exist");
      } else {
        toast.error("Email or password incorrect");
      }
    }

    if (data) {
      // get query param redirect from url
      const url = new URL(window.location.href);
      const redirect = url.searchParams.get("redirect");

      if (redirect) {
        openLinkSelf(atob(redirect));
        return;
      }

      router.navigate("/");
    }
  }

  async signUp(params: {
    userName: string;
    email: string;
    birthDate: string;
    gender: string;
    password: string;
  }) {
    const { error, data } = await this.authApiService.signUp(params);

    if (error) {
      if (error.message === ExceptionMessageCode.USER_EMAIL_EXISTS) {
        toast.error("User email already exists");
        return "err";
      }

      toast.error("Error on sign up");
      return "err";
    }

    if (data && data.isAccountVerified) {
      return "redirect";
    } else {
      bus.emit("show-alert", {
        message: "We have sent you account verification on you email",
      });
      return "ok";
    }
  }

  async accountVerify(params: { email: string }) {
    const { error } = await this.authApiService.verify(params);

    if (error) {
      if (error.message === ExceptionMessageCode.USER_EMAIL_EXISTS) {
        toast.error("User email already exists");
        return;
      }
      if (error.message === ExceptionMessageCode.USER_NOT_FOUND) {
        toast.error("User not found");
        return;
      }

      toast.error("Error on verify");
    }
  }

  async recoverPassword(params: { email: string }) {
    const { error, data } = await this.authApiService.recoverPassword({
      email: params.email,
    });

    if (error || !data) {
      if (!error) {
        toast.error("Sorry, something went wrong");
        return;
      }

      if (error.message === ExceptionMessageCode.USER_EMAIL_EXISTS) {
        toast.error("User email already exists");
        return;
      }
      if (error.message === ExceptionMessageCode.USER_NOT_FOUND) {
        toast.error("User not found");
        return;
      }

      toast.error("Error on verify");
    }
  }
}
