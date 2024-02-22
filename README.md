# Beapuls API

## Configuration

- Copy .env.exemple file and create .env with correct variables

- Generate APP_KEY with this following commmand :
    ```
    node ace generate:key
    ```

## Install

Install the dependencies
```
npm i
```
#
Star database
```
docker compose up
```
#
Run database migrations
```
node ace migration:run
```
#
Run database seeders
```
node ace db:seed
```
#
Run server
```
npm run dev
```
