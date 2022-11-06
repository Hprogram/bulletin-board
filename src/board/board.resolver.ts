import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BoardService } from './board.service';
import {
  CreateBoardIn,
  DeleteBoardIn,
  GetUserBoardIn,
  UpdateBoardIn,
} from './dto/board.in.dto';
import { GetUserBoardOut, BoardOut } from './dto/board.out.dto';

@Resolver()
export class BoardResolver {
  constructor(private readonly boardSvc: BoardService) {}

  private readonly logger = new Logger(BoardResolver.name);

  @Mutation((type) => BoardOut)
  async createBoard(@Args('param') param: CreateBoardIn): Promise<BoardOut> {
    this.logger.log('Create Board');
    return await this.boardSvc.createBoard(param);
  }

  @Mutation((type) => BoardOut)
  async updateBoard(@Args('param') param: UpdateBoardIn): Promise<BoardOut> {
    this.logger.log('Update Board');
    return await this.boardSvc.updateBoard(param);
  }

  @Mutation((type) => BoardOut)
  async deleteBoard(@Args('param') param: DeleteBoardIn): Promise<BoardOut> {
    this.logger.log('Delete Board');
    return await this.boardSvc.deleteBoard(param);
  }

  @Query((type) => GetUserBoardOut)
  async getUserBoardByAll(
    @Args('param') param: GetUserBoardIn,
  ): Promise<GetUserBoardOut> {
    this.logger.log('Get All User Board');
    return await this.boardSvc.getUserBoardByAll(param);
  }

  @Query((type) => BoardOut)
  async getUserBoardById(
    @Args('param') param: GetUserBoardIn,
  ): Promise<BoardOut> {
    this.logger.log('Get All User Board By Id');
    return await this.boardSvc.getUserBoardById(param);
  }
}
