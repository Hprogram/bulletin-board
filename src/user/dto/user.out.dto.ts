import { Field, ObjectType } from '@nestjs/graphql';
import { BaseOutDto } from 'src/shared/base.dto';
import { User } from '../user.model';

@ObjectType()
export class UserOut extends BaseOutDto {
  @Field((type) => User)
  user!: User;
}

@ObjectType()
export class getBoardsOut extends BaseOutDto {
  @Field((type) => User)
  author!: User;
}
