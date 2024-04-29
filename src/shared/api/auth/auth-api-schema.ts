export type SignInAndSignUpResponse = {
  isAccountVerified: boolean;
};

export class RecoverPasswordSendDto {
  email: string;
}
