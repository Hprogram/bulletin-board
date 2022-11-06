import { HttpException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { ErrorCode } from 'src/shared/error.code';
import { Repository } from 'typeorm';
import {
  CreateUserIn,
  DeleteUserIn,
  GetBoardsIn,
  GetTokenIn,
  GetUserTokenIn,
  SearchUserIn,
} from './dto/user.in.dto';
import { getBoardsOut, GetUserTokenOut, UserOut } from './dto/user.out.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
    private jwtSvc: JwtService,
  ) {
    console.log('use this repository user', User);
    this._usersRepository = _usersRepository;
  }

  private readonly logger = new Logger(UserService.name);

  async createUser({ name }: CreateUserIn): Promise<UserOut> {
    try {
      const responData = new UserOut();
      const user = new User();
      user.name = name;

      const findUser = await this._usersRepository.findOne({
        where: {
          name: name,
        },
      });

      if (findUser) {
        errorSet(responData, 'U004');
        throw new HttpException(responData, 400);
      }

      const saveUser = await this._usersRepository.save(user).catch((err) => {
        this.logger.error(err);
        return undefined;
      });

      if (!saveUser) {
        errorSet(responData, 'U001');
        throw new HttpException(responData, 404);
      } else {
        responData.user = saveUser;
        responData.done = true;
        return responData;
      }
    } catch (err) {
      throw err;
    }
  }

  async deleteUser({ name }: DeleteUserIn): Promise<UserOut> {
    try {
      const responData = new UserOut();
      // 해당 유저가 있는지 검색 (id 기반)
      const user = await this._usersRepository.findOne({
        where: {
          name: name,
        },
      });

      if (!user) {
        errorSet(responData, 'U003');
        throw new HttpException(responData, 404);
      } else {
        await this._usersRepository.softDelete({ id: user.id });
        user.deletedAt = new Date();

        responData.done = true;
        responData.user = user;
      }

      return responData;
    } catch (err) {
      throw err;
    }
  }

  //유저 검색
  async searchUser({ id }: SearchUserIn): Promise<UserOut> {
    try {
      const responData = new UserOut();
      // 해당 유저가 있는지 검색 (id 기반)
      const user = await this._usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!user) {
        errorSet(responData, 'U002');
        throw new HttpException(responData, 404);
      } else {
        responData.done = true;
        responData.user = user;
      }

      return responData;
    } catch (err) {
      throw err;
    }
  }

  //유저 검색
  async getBoards({ userName }: GetBoardsIn): Promise<getBoardsOut> {
    try {
      const responData = new getBoardsOut();
      // 해당 유저가 있는지 검색 (id 기반)
      const user = await this._usersRepository.findOne({
        relations: ['boards'],
        where: {
          name: userName,
        },
      });

      if (!user) {
        errorSet(responData, 'U002');
        throw new HttpException(responData, 404);
      } else {
        responData.done = true;
        responData.author = user;
      }

      return responData;
    } catch (err) {
      throw err;
    }
  }

  // 유저 getBoards jwt 버전
  async getBoardsJwt(input: GetTokenIn): Promise<getBoardsOut> {
    try {
      const responData = new getBoardsOut();
      // 해당 유저가 있는지 검색 (id 기반)
      const user = await this._usersRepository.findOne({
        relations: ['boards'],
        where: {
          id: input.id,
        },
      });

      if (!user) {
        errorSet(responData, 'U002');
        throw new HttpException(responData, 404);
      } else {
        responData.done = true;
        responData.author = user;
      }

      return responData;
    } catch (err) {
      throw err;
    }
  }

  // 유저 삭제 jwt 버전
  async deleteUserJwt(input: GetTokenIn): Promise<UserOut> {
    try {
      const responData = new UserOut();
      // 해당 유저가 있는지 검색 (id 기반)
      const user = await this._usersRepository.findOne({
        where: {
          id: input.id,
        },
      });
      if (!user) {
        errorSet(responData, 'U003');
        throw new HttpException(responData, 404);
      } else {
        await this._usersRepository.softDelete({ id: user.id });
        user.deletedAt = new Date();

        responData.done = true;
        responData.user = user;
      }

      return responData;
    } catch (err) {
      throw err;
    }
  }

  //유저 토큰 발급 (1시간)
  async getUserToken({ userName }: GetUserTokenIn): Promise<GetUserTokenOut> {
    try {
      const responData = new GetUserTokenOut();
      // 해당 유저가 있는지 검색 (id 기반)
      const user = await this._usersRepository.findOne({
        where: {
          name: userName,
        },
      });

      if (!user) {
        errorSet(responData, 'U002');
        throw new HttpException(responData, 404);
      } else {
        const payload = {
          userName: user.name,
          id: user.id,
        };

        const accessToken = this.jwtSvc.sign(payload);

        responData.done = true;
        responData.user = user;
        responData.accessToken = accessToken;
      }

      return responData;
    } catch (err) {
      throw err;
    }
  }
}

// 에러 반환 함수
function errorSet(responData: any, code: string) {
  responData.done = false;
  responData.code = code;
  responData.error = ErrorCode[code];

  return responData;
}
