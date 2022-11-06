import { Field, ObjectType } from '@nestjs/graphql';
import { BaseOutDto } from 'src/shared/base.dto';
import { User } from '../user.model';

@ObjectType()
export class CreateUserOut extends BaseOutDto {
  @Field((type) => User)
  user!: User;
}

@ObjectType()
export class DeleteUserOut extends BaseOutDto {
  @Field((type) => User)
  user!: User;
}
