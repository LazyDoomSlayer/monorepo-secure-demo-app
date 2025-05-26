// src/auth/admin-seeder.service.ts

import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { Role } from './auth.enum';

@Injectable()
export class AdminSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const username = this.config.get<string>('ADMIN_USERNAME');
    const password = this.config.get<string>('ADMIN_PASSWORD');
    if (!username || !password) {
      throw new UnauthorizedException();
    }

    try {
      let admin = await this.users.findOne({ where: { username } });

      if (!admin) {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        admin = this.users.create({
          username,
          password: hash,
          role: Role.Admin,
        });
        await this.users.save(admin);
        this.logger.log(`✨ Created admin user "${username}"`);
      } else if (admin.role !== Role.Admin) {
        admin.role = Role.Admin;
        await this.users.save(admin);
        this.logger.log(`🔧 Promoted "${username}" to admin`);
      } else {
        this.logger.log(`✅ Admin "${username}" already exists`);
      }
    } catch (err) {
      this.logger.error(`Failed to seed admin: ${err.message}`, err.stack);
    }
  }
}
