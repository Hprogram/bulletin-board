import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { ErrorCode } from 'src/shared/error.code';
import { Repository } from 'typeorm';
import {
  CreateUserIn,
  DeleteUserIn,
  GetBoardsIn,
  SearchUserIn,
} from './dto/user.in.dto';
import { getBoardsOut, UserOut } from './dto/user.out.dto';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
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
}

// 에러 반환 함수
function errorSet(responData: any, code: string) {
  responData.done = false;
  responData.code = code;
  responData.error = ErrorCode[code];

  return responData;
}
