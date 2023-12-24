import { Gender } from '../../../models/enum/gender.enum';

export class UserResponseDto {
  id: number;
  email: string;
  userName: string;
  birthDate: string;
  gender: Gender;
  createdAt: Date;
  isOnline: boolean;
}
