import Knex from "knex";
import knexfile from "@/knexfile";
import { types } from "pg";

console.log("connected to " + knexfile.connection);

export const knex = Knex(knexfile);
export type QueryBuilder = Knex.Knex.QueryBuilder
export type Raw = Knex.Knex.Raw;

types.setTypeParser(types.builtins.INT8, (value: string) => {
  return parseInt(value);
});

types.setTypeParser(types.builtins.FLOAT8, (value: string) => {
  return parseFloat(value);
});

types.setTypeParser(types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value);
});

types.setTypeParser(types.builtins.DATE, (value: string) => value);
