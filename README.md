# Beapuls API

## Configuration

- Copy .env.exemple file and create .env with correct variables

- Generate APP_KEY with this following commmand :
  ```
  node ace generate:key
  ```

## Install

Install the dependencies

```bash
npm i
```

#

Star database

```bash
docker compose up
```

#

Run database migrations

```bash
node ace migration:run
```

#

Run database seeders

```bash
node ace db:seed
```

#

Run server

```bash
npm run dev
```

## Utils 

List all routes of API

```bash
node ace route:list
```

