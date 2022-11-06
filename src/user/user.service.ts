import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { Repository } from 'typeorm';
import { CreateUserIn, DeleteUserIn } from './dto/user.in.dto';
import { CreateUserOut, DeleteUserOut } from './dto/user.out.dto';
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

  async createUser(input: CreateUserIn): Promise<CreateUserOut> {
    try {
      const responData = new CreateUserOut();
      const user = new User();
      user.name = input.name;

      const saveUser = await this._usersRepository.save(user).catch((err) => {
        this.logger.error(err);
        return undefined;
      });

      if (!saveUser) {
        responData.done = false;
        responData.code = 'U001';
        responData.error = '유저 생성 실패';
        throw new HttpException(responData, 404);
      } else {
        console.log(saveUser);

        responData.user = saveUser;
        responData.done = true;
        return responData;
      }
    } catch (err) {
      throw err;
    }
  }

  async deleteUser({ id }: DeleteUserIn): Promise<any> {
    try {
      const responData = new DeleteUserOut();
      // 해당 유저가 있는지 검색 (id 기반)
      const user = await this._usersRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!user) {
        responData.done = false;
        responData.code = 'U002';
        responData.error = '해당 id를 가진 유저가 존재하지 않습니다.';
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
}
