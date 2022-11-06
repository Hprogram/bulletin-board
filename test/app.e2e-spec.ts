/* eslint-disable @typescript-eslint/no-unused-vars */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { config } from 'dotenv';
import { resolve } from 'path';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { getConnection, Repository } from 'typeorm';
import { User } from 'src/user/user.model';
import { Board } from 'src/board/board.model';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let userRepository: Repository<User>;
  let boardRepository: Repository<Board>;
  beforeEach(async () => {
    config({ path: resolve(__dirname, `../.${process.env.NODE_ENV}.env`) });
    console.log(process.env.NODE_ENV);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    boardRepository = moduleFixture.get<Repository<Board>>(
      getRepositoryToken(Board),
    );
    await app.init();
  });

  afterAll(async () => {
    // e2e 테스트 후 db drop
    await getConnection().dropDatabase();
    app.close();
  });

  // 기본 테스트
  it('get hello', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{hello}' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.hello).toBe('Hello World!');
      });
  });

  // 유저 생성 테스트
  it('user create', async () => {
    const name = 'seoltab';
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
        createUser(param:{
          name: "${name}"
        }){
          done
          user{
            id
            name
          }
        }
      }`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.createUser.user.name).toBe(name);
      });
  });

  // 유저 검색 테스트
  it('user search', () => {
    const name = 'seoltab';
    const id = 1;
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query {
        searchUser(param:{
          id: ${id}
        }){
          done
          user{
            id
            name
          }
        }
      }`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.searchUser.user.name).toBe(name);
      });
  });

  // // 유저 삭제 테스트
  // it('user delete', () => {
  //   const name = 'seoltab';
  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({
  //       query: `mutation {
  //       deleteUser(param:{
  //         name: "${name}"
  //       }){
  //         done
  //         user{
  //           id
  //           name
  //         }
  //       }
  //     }`,
  //     })
  //     .expect(200)
  //     .expect(({ body }) => {
  //       expect(body.data.deleteUser.user.name).toBe(name);
  //     });
  // });

  // 유저 콘텐츠 생성 테스트
  it('user create board', () => {
    const board = {
      title: '설탭 소개',
      content: '국내 넘버원 과외 설탭',
    };

    const name = 'seoltab';

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          createBoard(param:{
            title: "${board.title}",
            content:"${board.content}", 
            userName:"${name}"
          }){
            done
            board{
              id
              title
              content
              author{
                id
                name
              }
            }
          }
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.createBoard.board.title).toBe(board.title);
        expect(body.data.createBoard.board.content).toBe(board.content);
        expect(body.data.createBoard.board.author.name).toBe(name);
      });
  });

  // 유저가 쓴 글 모두 가져오기
  it('boards of user', () => {
    const name = 'seoltab';
    const board = {
      title: '설탭 소개',
      content: '국내 넘버원 과외 설탭',
    };

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query {
          getBoards(param:{
            userName:"${name}"
          }){
            done
            author{
              id
              name
              boards{
                id
                title
                content
              }
            }

          }
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        console.log(body.data.getBoards.author);
        expect(body.data.getBoards.author.name).toBe(name);
        // 이전 테스트에서 유저가 작성한 글이 해당 유저가 작성한 글 안에 포함되었는지 확인.
        expect(body.data.getBoards.author.boards).toEqual(
          expect.arrayContaining([expect.objectContaining(board)]),
        );
      });
  });

  // 유저 콘텐츠 업데이트 테스트
  it('user update board', () => {
    const board = {
      title: '설탭 소개 업데이트 테스트',
      content: '국내 넘버원 과외 설탭 업데이트 테스트',
    };
    const boardId = 1;
    const name = 'seoltab';

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          updateBoard(param:{
            title: "${board.title}",
            content:"${board.content}", 
            userName:"${name}",
            boardId: ${boardId}
          }){
            done
            board{
              id
              title
              content
              author{
                id
                name
              }
            }
          }
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.updateBoard.board.title).toBe(board.title);
        expect(body.data.updateBoard.board.content).toBe(board.content);
        expect(body.data.updateBoard.board.author.name).toBe(name);
      });
  });

  // 유저 콘텐츠 단일 검색 테스트
  it('user search board', () => {
    const board = {
      title: '설탭 소개 업데이트 테스트',
      content: '국내 넘버원 과외 설탭 업데이트 테스트',
    };
    const boardId = 1;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `query {
          searchBoard(param:{
            boardId: ${boardId}
          }){
            done
            board{
              id
              title
              content
              author{
                id
                name
              }
            }
          }
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.searchBoard.board.id).toBe(boardId.toString());
        expect(body.data.searchBoard.board.title).toBe(board.title);
        expect(body.data.searchBoard.board.content).toBe(board.content);
      });
  });

  // 유저 콘텐츠 삭제 테스트
  it('user delete board', () => {
    const boardId = 1;
    const name = 'seoltab';

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `mutation {
          deleteBoard(param:{
            userName:"${name}",
            boardId: ${boardId}
          }){
            done
            board{
              id
              title
              content
              author{
                id
                name
              }
            }
          }
        }`,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.deleteBoard.board.author.name).toBe(name);
        expect(body.data.deleteBoard.board.id).toBe(boardId.toString());
      });
  });
});
