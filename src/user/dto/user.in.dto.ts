import { Field, InputType } from '@nestjs/graphql';

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
