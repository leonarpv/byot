import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserRegister } from '../graphql/ts/types';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {
  }

  public async createUser(userRegister: UserRegister): Promise<Auth> {
    const user = {
      ...userRegister,
      password: bcrypt.hashSync(userRegister.password, 10),
    };
    const entity = await this.userService.create(user);
    return {
      token: this.createTokenForUser(entity),
      user: entity,
    };
  }

  public createTokenForUser(user: User): string {
    return this.jwtService.sign({
      email: user.email,
      role: user.role,
      id: user.id,
    });
  }

  public async login(userNameOrEmail: string, password: string): Promise<Auth> {
    const user = await this.userService.findByUsernameOrEmail(userNameOrEmail);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }
    return {
      user,
      token: this.createTokenForUser(user),
    };
  }
}
