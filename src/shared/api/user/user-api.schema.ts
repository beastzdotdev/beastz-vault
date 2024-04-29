import { Gender } from '../../enum/gender.enum';

export class UserResponseDto {
  id: number;
  email: string;
  userName: string;
  birthDate: string;
  gender: Gender;
  createdAt: Date;
  isOnline: boolean;
  profileImagePath: string | null;
  profileFullImagePath: string | null;
}

export class UpdateUserDetailsDto {
  userName?: string;
  birthDate?: Date;
  gender?: Gender;
}
