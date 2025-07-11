import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../repositories/user.repository';
import { JWT_SECRET } from '../../../assets/constants';
import { IJwtPayload } from '../types/jwt-payload.interface';
import { User } from '../entities/user.entity';
import { EAuthErrorMessages } from '../types/auth.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      secretOrKey: 'VerySecretKey',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException(EAuthErrorMessages.WRONG_CREDENTIALS);
    }

    return user;
  }
}
