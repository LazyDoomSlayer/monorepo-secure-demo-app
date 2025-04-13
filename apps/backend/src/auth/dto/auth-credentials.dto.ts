import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { DEFAULT_PASSWORD_PATTERN } from 'src/assets/patterns';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @Matches(DEFAULT_PASSWORD_PATTERN, { message: 'Your password is shithole.' })
  password: string;
}
