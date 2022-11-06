import { Logger, Req, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserIn,
  DeleteUserIn,
  GetBoardsIn,
  GetUserTokenIn,
  SearchUserIn,
} from './dto/user.in.dto';
import {
  getBoardsOut as GetBoardsOut,
  GetUserTokenOut,
  UserOut,
} from './dto/user.out.dto';
import { JwtAuthGuard } from './jwt/JwtAuthGuard';

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

  @Query((type) => GetBoardsOut)
  async getBoards(@Args('param') param: GetBoardsIn): Promise<GetBoardsOut> {
    this.logger.log('Search User');
    return await this.userSvc.getBoards(param);
  }

  @Query((type) => GetUserTokenOut)
  async getUserToken(
    @Args('param') param: GetUserTokenIn,
  ): Promise<GetUserTokenOut> {
    this.logger.log('get User Token');
    return await this.userSvc.getUserToken(param);
  }

  @Query((type) => GetBoardsOut)
  @UseGuards(JwtAuthGuard)
  async getBoardsJwt(@Context() context: any): Promise<GetBoardsOut> {
    this.logger.log('Search User');
    return await this.userSvc.getBoardsJwt(context.req.user);
  }

  @Mutation((type) => UserOut)
  @UseGuards(JwtAuthGuard)
  async deleteUserJwt(@Context() context: any): Promise<UserOut> {
    this.logger.log('Delete User');
    return await this.userSvc.deleteUserJwt(context.req.user);
  }
}
