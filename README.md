# Beapuls API

## Grafana trace implementation

- Config files form Grafana, Prometheus, Promtail, Tempo in config folde at .
- Create services for Docker in the Docker-compose file with the previous configuration files
- Run docker container with this following command : 

  ```
  docker compose up
  ```

- Install all @opentelemetry packages

- Creating of trace.ts file at roots with provider registration

- Implement and using trace in custom route '/trace' in './start/routes.ts'

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
