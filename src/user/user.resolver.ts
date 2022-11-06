import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserIn,
  DeleteUserIn,
  GetBoardsIn,
  SearchUserIn,
} from './dto/user.in.dto';
import { getBoardsOut, UserOut } from './dto/user.out.dto';

import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userSvc: UserService,
    private readonly logger: Logger,
  ) {}

  @Mutation((type) => UserOut)
  async createUser(@Args('param') param: CreateUserIn): Promise<UserOut> {
    this.logger.log('Create User');
    return await this.userSvc.createUser(param);
  }

  @Mutation((type) => UserOut)
  async deleteUser(@Args('param') param: DeleteUserIn): Promise<UserOut> {
    this.logger.log('Delete User');
    return await this.userSvc.deleteUser(param);
  }

  @Query((type) => UserOut)
  async searchUser(@Args('param') param: SearchUserIn): Promise<UserOut> {
    this.logger.log('Search User');
    return await this.userSvc.searchUser(param);
  }

  @Query((type) => getBoardsOut)
  async getBoards(@Args('param') param: GetBoardsIn): Promise<getBoardsOut> {
    this.logger.log('Search User');
    return await this.userSvc.getBoards(param);
  }
}
