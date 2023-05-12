## Init

#### Clone from Github.com

```bash
    git clone https://github.com/minigar/Halo-Lab_Task.git
```

#### Install dependencies newest versions or version that I used

```bash
  yarn install --frozen-lockfile
  yarn install
```

#### ./.env file config

```bash
APP_PORT=<PORT>
DATABASE_URL="postgresql://<USERNAME>:<PASSWORD>@0.0.0.0:5432/<DB>?schema=public"
SENSORS_QUEUE=<"NAME">
```

#### Start DataBase and Redis containers (-d means detached - hide process)

```bash
  docker-compose up -d
```

#### Generate PrismaORM models

```bash
  npx prisma generate
```

#### Migrate

```bash
  npx prisma migrate dev --name init
```

#### Check DB
```bash
  npx prisma studio
```

#### Swagger
```bash
  http://localhost:<PORT>/swagger
```

#### Start Server(or in dev mode)

```bash
   yarn start
   yarn start:dev
```

#### Only if linux(Arch based) use this command before start containers

```bash
  sudo systemctl stop postgresql.service
```
