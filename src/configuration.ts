import { registerAs } from "@nestjs/config";

export default Object.freeze({
  database: registerAs("database", () => ({
    type: process.env.DATABASE_TYPE,
    name: process.env.POSTGRESQL_DBNAME,
    port: +process.env.POSTGRESQL_PORT,
    username: process.env.POSTGRESQL_USER,
    password: process.env.POSTGRESQL_PASSWORD,
    uri: process.env.POSTGRESQL_URI
  })),
  cache: registerAs('cache', () => ({
    uri: process.env.REDIS_URL
  })),
  env: registerAs("env", () => ({
    secret: process.env.SECRET,
    throttle_ttl: +process.env.THROTTLE_TTL,
    throttle_limit: +process.env.THROTTLE_LIMIT,
    access_token_ttl: 1000 * 60 * 60 * 24 * 7,
    refresh_token_ttl: 1000 * 60 * 60 * 24 * 7 * 4,
    swagger_title: process.env.SWAGGER_TITLE,
    swagger_description: process.env.SWAGGER_DESCRIPTION,
    swagger_version: process.env.SWAGGER_VERSION
  }))
});
