import { Logger, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/JwtStrategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'test-secret', // 실 서버의 경우 env 파일로 관리.
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService, UserResolver, Logger, JwtStrategy],
  exports: [TypeOrmModule],
})
export class UserModule {}
