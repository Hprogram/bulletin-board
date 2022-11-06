import { Field, ObjectType } from '@nestjs/graphql';
import { BaseOutDto } from 'src/shared/base.dto';
import { User } from 'src/user/user.model';
import { Board } from '../board.model';

@ObjectType()
export class CreateBoardOut extends BaseOutDto {
  @Field((type) => Board)
  board?: Board;
}

@ObjectType()
export class UpdateBoardOut extends BaseOutDto {
  @Field((type) => Board)
  board?: Board;
}

@ObjectType()
export class DeleteBoardOut extends BaseOutDto {
  @Field((type) => Board)
  board?: Board;
}
