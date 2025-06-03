import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { ERROR_CODE_FOR_DUBLICATE } from '../../../assets/constants';
import { EAuthErrorMessages } from '../types/auth.enum';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private _dataSource: DataSource) {
    super(User, _dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const user = this.create({
      username,
      password
    });

    try {
      await this.save(user);
    } catch (error: unknown) {
      if ((error as { code?: string })?.code === ERROR_CODE_FOR_DUBLICATE) {
        throw new ConflictException(EAuthErrorMessages.USER_EXISTS);
      }

      throw new InternalServerErrorException();
    }
  }
}
