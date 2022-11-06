import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BoardService } from './board.service';
import { CreateBoardIn } from './dto/board.in.dto';
import { CreateBoardOut } from './dto/board.out.dto';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardSvc: BoardService) {}

  private readonly logger = new Logger(BoardResolver.name);

  @Mutation((type) => CreateBoardOut)
  async createBoard(
    @Args('param') param: CreateBoardIn,
  ): Promise<CreateBoardOut> {
    this.logger.log('Create Board');
    return await this.boardSvc.createBoard(param);
  }
}
