import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { BoardService } from './board.service';
import {
  CreateBoardIn,
  DeleteBoardIn,
  UpdateBoardIn,
} from './dto/board.in.dto';
import {
  CreateBoardOut,
  DeleteBoardOut,
  UpdateBoardOut,
} from './dto/board.out.dto';

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

  @Mutation((type) => UpdateBoardOut)
  async updateBoard(
    @Args('param') param: UpdateBoardIn,
  ): Promise<UpdateBoardOut> {
    this.logger.log('Create Board');
    return await this.boardSvc.updateBoard(param);
  }

  @Mutation((type) => DeleteBoardOut)
  async deleteBoard(
    @Args('param') param: DeleteBoardIn,
  ): Promise<DeleteBoardOut> {
    this.logger.log('Create Board');
    return await this.boardSvc.deleteBoard(param);
  }
}
