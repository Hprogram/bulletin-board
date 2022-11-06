import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { Repository } from 'typeorm';

import { Board } from './board.model';
import { CreateBoardIn } from './dto/board.in.dto';
import { CreateBoardOut } from './dto/board.out.dto';

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
  }: CreateBoardIn): Promise<CreateBoardOut> {
    try {
      const responData = new CreateBoardOut();
      if (!title) {
        responData.done = false;
        responData.code = 'B002';
        responData.error = '타이틀을 입력해주세요.';
        throw new HttpException(responData, 400);
      }

      if (!content) {
        responData.done = false;
        responData.code = 'B003';
        responData.error = 'content을 입력해주세요.';
        throw new HttpException(responData, 400);
      }

      if (!user_id) {
        responData.done = false;
        responData.code = 'B004';
        responData.error = 'user_id을 입력해주세요.';
        throw new HttpException(responData, 400);
      }

      const board = new Board();

      const user: User = await this._userRepository.findOne({
        where: {
          id: user_id,
        },
      });

      if (!user) {
        responData.done = false;
        responData.code = 'U002';
        responData.error = '해당 id를 가진 유저가 존재하지 않습니다.';
        throw new HttpException(responData, 400);
      }

      board.title = title;
      board.content = content;
      board.author = user;

      const saveBoard = await this._boardRepository.save(board);

      if (!saveBoard) {
        responData.done = false;
        responData.code = 'B001';
        responData.error = '글 작성 실패';
        throw new HttpException(responData, 404);
      } else {
        responData.done = true;
        responData.board = board;

        return responData;
      }
    } catch (err) {
      throw err;
    }
  }
}
