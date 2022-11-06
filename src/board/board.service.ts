import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { title } from 'process';
import { ErrorCode } from 'src/shared/error.code';
import { User } from 'src/user/user.model';
import { Repository } from 'typeorm';

import { Board } from './board.model';
import {
  CreateBoardIn,
  DeleteBoardIn,
  GetUserBoardIn,
  UpdateBoardIn,
} from './dto/board.in.dto';
import { GetUserBoardOut, BoardOut } from './dto/board.out.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board) private _boardRepository: Repository<Board>,
    @InjectRepository(User) private _userRepository: Repository<User>,
  ) {
    console.log('use this repository board', Board);
    this._boardRepository = _boardRepository;
    this._userRepository = _userRepository;
  }

  private readonly logger = new Logger(BoardService.name);

  // Board에 글 작성 (생성)
  async createBoard({
    title,
    content,
    user_id,
  }: CreateBoardIn): Promise<BoardOut> {
    try {
      const responData = new BoardOut();
      if (!title) {
        errorSet(responData, 'B003');
        throw new HttpException(responData, 400);
      }

      if (!content) {
        errorSet(responData, 'B004');
        throw new HttpException(responData, 400);
      }

      if (!user_id) {
        errorSet(responData, 'B005');
        throw new HttpException(responData, 400);
      }

      const board = new Board();

      // user_id로 User 검색. 후에 JWT
      const user: User = await this._userRepository.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        errorSet(responData, 'U002');
        throw new HttpException(responData, 400);
      }

      board.title = title;
      board.content = content;
      board.author = user;

      const saveBoard = await this._boardRepository.save(board);

      if (!saveBoard) {
        errorSet(responData, 'B001');
        throw new HttpException(responData, 404);
      } else {
        responData.done = true;
        responData.message = '정상적으로 작성 되었습니다.';
        responData.board = board;

        return responData;
      }
    } catch (err) {
      throw err;
    }
  }

  // Board에 작성한 글 업데이트
  async updateBoard({
    title,
    content,
    user_id,
    board_id,
  }: UpdateBoardIn): Promise<BoardOut> {
    try {
      const responData = new BoardOut();

      if (!user_id) {
        errorSet(responData, 'B005');
        throw new HttpException(responData, 400);
      }

      if (!board_id) {
        errorSet(responData, 'B006');
        throw new HttpException(responData, 400);
      }

      // user_id로 User 검색. 후에 JWT
      const user: User = await this._userRepository.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        // 해당 id user 존재하지 않음.
        errorSet(responData, 'U002');
        throw new HttpException(responData, 400);
      }

      // user가 있다면 user가 작성한 board id가 맞는지 검색
      const board: Board = await this._boardRepository.findOne({
        relations: ['author'],
        where: {
          id: board_id,
          author: user,
        },
      });

      if (!board) {
        // 해당 id board 존재하지 않음.
        errorSet(responData, 'B002');
        throw new HttpException(responData, 400);
      }

      // User,Board 모두 존재한다면
      if (title) {
        board.title = title;
      }
      if (content) {
        board.content = content;
      }

      const saveBoard = await this._boardRepository.save(board);

      if (!saveBoard) {
        // 글 업데이트 실패
        errorSet(responData, 'B001');
        throw new HttpException(responData, 404);
      } else {
        responData.done = true;
        responData.message = '정상적으로 업데이트 되었습니다.';
        responData.board = board;

        return responData;
      }
    } catch (err) {
      throw err;
    }
  }

  // Board에 작성한 글 삭제 (softDelete)
  async deleteBoard({ user_id, board_id }: DeleteBoardIn): Promise<BoardOut> {
    try {
      const responData = new BoardOut();

      if (!user_id) {
        errorSet(responData, 'B005');
        throw new HttpException(responData, 400);
      }

      if (!board_id) {
        errorSet(responData, 'B006');
        throw new HttpException(responData, 400);
      }

      // user_id로 User 검색. 후에 JWT
      const user: User = await this._userRepository.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        // 해당 id user 존재하지 않음.
        errorSet(responData, 'U002');
        throw new HttpException(responData, 400);
      }

      // user가 있다면 user가 작성한 board id가 맞는지 검색
      const board: Board = await this._boardRepository.findOne({
        relations: ['author'],
        where: {
          id: board_id,
          author: user,
        },
      });

      if (!board) {
        // 해당 id board 존재하지 않음.
        errorSet(responData, 'B002');
        throw new HttpException(responData, 400);
      }

      // User,Board 모두 존재한다면
      const saveBoard = await this._boardRepository.softDelete({
        id: board.id,
      });

      if (!saveBoard) {
        // 글 업데이트 실패
        errorSet(responData, 'B001');
        throw new HttpException(responData, 404);
      } else {
        board.deletedAt = new Date();
        responData.done = true;
        responData.message = '정상적으로 삭제 되었습니다.';
        responData.board = board;

        return responData;
      }
    } catch (err) {
      throw err;
    }
  }

  // Board에 User가 작성한 글 모아보기
  async getUserBoardByAll({
    user_id,
  }: GetUserBoardIn): Promise<GetUserBoardOut> {
    try {
      const responData = new GetUserBoardOut();

      if (!user_id) {
        errorSet(responData, 'B005');
        throw new HttpException(responData, 400);
      }

      // user_id로 User 검색. 후에 JWT
      const user: User = await this._userRepository.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        // 해당 id user 존재하지 않음.
        errorSet(responData, 'U002');
        throw new HttpException(responData, 400);
      }

      // user가 있다면 user가 작성한 board를 모두 검색 (최신순 정렬)
      const board: Board[] = await this._boardRepository.find({
        relations: ['author'],
        where: {
          author: user,
        },
      });

      board.sort((a, b) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      if (board.length <= 0) {
        // 해당 id board 존재하지 않음.
        errorSet(responData, 'B007');
        throw new HttpException(responData, 404);
      } else {
        responData.done = true;
        responData.message = '유저가 작성한 글을 모두 불러왔습니다.';
        responData.board = board;

        return responData;
      }
    } catch (err) {
      throw err;
    }
  }

  // Board에 User가 작성한 특정 글 가져오기 (ID)
  async getUserBoardById({
    user_id,
    board_id,
  }: GetUserBoardIn): Promise<BoardOut> {
    try {
      const responData = new BoardOut();

      if (!user_id) {
        errorSet(responData, 'B005');
        throw new HttpException(responData, 400);
      }

      if (!board_id) {
        errorSet(responData, 'B006');
        throw new HttpException(responData, 400);
      }

      // user_id로 User 검색. 후에 JWT
      const user: User = await this._userRepository.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        // 해당 id user 존재하지 않음.
        errorSet(responData, 'U002');
        throw new HttpException(responData, 400);
      }

      // user가 있다면 user가 작성한 board id가 맞는지 검색
      const board: Board = await this._boardRepository.findOne({
        relations: ['author'],
        where: {
          id: board_id,
          author: user,
        },
      });

      if (!board) {
        // 해당 id board 존재하지 않음.
        errorSet(responData, 'B002');
        throw new HttpException(responData, 400);
      } else {
        responData.done = true;
        responData.message = '정상적으로 불러왔습니다.';
        responData.board = board;

        return responData;
      }
    } catch (err) {
      throw err;
    }
  }
}

// 에러 반환 함수
function errorSet(responData: any, code: string) {
  responData.done = false;
  responData.code = code;
  responData.error = ErrorCode[code];

  return responData;
}
