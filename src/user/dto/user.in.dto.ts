import { Field, InputType } from '@nestjs/graphql';
import { User } from '../user.model';

@InputType()
export class CreateUserIn {
  @Field((type) => String)
  name!: string;
}

@InputType()
export class DeleteUserIn {
  @Field((type) => String)
  name!: string;
}

@InputType()
export class SearchUserIn {
  @Field((type) => Number)
  id!: number;
}

@InputType()
export class GetBoardsIn {
  @Field((type) => String)
  userName!: string;
}

@InputType()
export class GetUserTokenIn {
  @Field((type) => String)
  userName!: string;
}

@InputType()
export class GetTokenIn {
  @Field((type) => Number)
  id!: number;

  @Field((type) => String)
  userName!: string;
}
