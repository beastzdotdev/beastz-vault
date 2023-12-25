import { Gender } from '../shared';

export class User {
  id: number;
  email: string;
  userName: string;
  birthDate: string;
  gender: Gender;
  createdAt: Date;
  isOnline: boolean;
}
