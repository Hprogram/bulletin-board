import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserIn, DeleteUserIn } from './dto/user.in.dto';
import { CreateUserOut, DeleteUserOut } from './dto/user.out.dto';

import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userSvc: UserService,
    private readonly logger: Logger,
  ) {}

  @Mutation((type) => CreateUserOut)
  async createUser(@Args('param') param: CreateUserIn): Promise<CreateUserOut> {
    this.logger.log('Create User');
    return await this.userSvc.createUser(param);
  }

  @Mutation((type) => DeleteUserOut)
  async deleteUser(@Args('param') param: DeleteUserIn): Promise<DeleteUserOut> {
    this.logger.log('Delete User');
    return await this.userSvc.deleteUser(param);
  }
}
