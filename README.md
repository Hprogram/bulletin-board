# 게시판구현

## docker

docker-compose환경

- db, server, test 모두 service로 들어가 있습니다.

- `src/shared/util/typeOrmConfig`에 db connection 정보가 있습니다.

```typescript
export const typeormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  port: 5432,
  username: 'testuser',
  password: 'testpasswd',
  database: 'testdb',
  synchronize: true,
  entities: [`${path.join(__dirname, '..', '..', '**')}/*.model.[tj]s`],
  host,
};
```

### build

```bash
$ docker-compose build
```

### start all

```bash
$ docker-compose up server db
```

### start only api server

```bash
$ docker-compose up server
```

### start only test

```bash
$ docker-compose up test
```

### Stops containers and removes containers, networks, volumes

```bash
$ docker-compose down
```

## local 개발 환경

### Installation

```bash
$ yarn install
```

### Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### Test

```bash
# e2e tests
$ npm run test:e2e

```

## 기획

### 구현해야 될 것

유저가 글을 작성할 수 있는 게시판

유저를 생성할 수 있다.

유저는 글을 작성/수정/삭제 할 수 있다.

유저가 쓴 글을 모아서 볼 수 있다.

유저나 글에 대해서 검색을 할 수 있다 (id)

- Base Model

```typescript
@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  @PrimaryGeneratedColumn('increment')
  @Field((_) => ID)
  id!: number;

  @CreateDateColumn()
  @Field((_) => Date)
  createdAt!: Date;

  @UpdateDateColumn()
  @Field((_) => Date)
  updatedAt!: Date;

  @Column({ nullable: true })
  @Field((_) => Date, { nullable: true })
  deletedAt?: Date;
}
```

- User Model

```typescript
@ObjectType()
@Entity()
export class User extends BaseModel {
  @Column()
  @Field((_) => String)
  name!: string;

  @OneToMany(
    () => Board,
    (board) => board.author,
  )
  @Field((_) => [Board])
  boards!: Board[];
}
```

- Board Model

```typescript
@Entity()
@ObjectType()
export class Board extends BaseModel {
  @Column()
  @Field((_) => String)
  title!: string;

  @Column()
  @Field((_) => String)
  content!: string;

  @ManyToOne(
    () => User,
    (user) => user.boards,
  )
  @Field((_) => User)
  author!: User;
}
```

### API

유저 생성 : createUser

유저 삭제 : deleteUser ( soft delete )

board 작성 : createBoard

유저가 작성한 board 검색 : getBoards

