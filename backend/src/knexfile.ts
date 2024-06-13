import type { Knex } from "knex";
import { env } from "./env";

// console.log("env:", env);

const config: { [key: string]: Knex.Config } = {
  // dev: {
  //   client: "postgresql",
  //   connection: {
  //     host: env.DB_HOST,
  //     user: env.DB_USER,
  //     port: env.DB_PORT,
  //     password: env.DB_PASS,
  //     database: env.DB_NAME,
  //   },
  //   debug: true,
  //   migrations: {
  //     directory: "./migrations",
  //   },
  //   pool: { min: 2, max: 10 },
  //   seeds: {
  //     directory: "../seeds/dev",
  //   },
  // },
  prod: {
    client: "postgresql",
    connection: {
      host: env.DB_HOST,
      user: env.DB_USER,
      port: env.DB_PORT,
      password: env.DB_PASS,
      database: env.DB_NAME,
    },
    debug: env.STAGE == "dev",
    migrations: {
      directory: "./migrations",
    },
    pool: { min: 2, max: 10 },
  },
};

const knexConfig = config["prod"];

export default knexConfig;
