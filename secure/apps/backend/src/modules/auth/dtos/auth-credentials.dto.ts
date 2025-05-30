import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { DEFAULT_PASSWORD_PATTERN } from '../../../assets/patterns';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(64)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(DEFAULT_PASSWORD_PATTERN, {
    message:
      'Password must be 8–64 characters long and include uppercase, lowercase, number, and special character.',
  })
  password: string;
}
