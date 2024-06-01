import { Knex } from "knex";

const ruleCand = ["ruleViolation", "spam", "scam", "hate", "sexual", "repeat", "threatening", "copyrightViolation", "illegal"];

const ruleConcat = ruleCand.map((cand) => `'${cand}'`).join(",");

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`--sql
  ALTER TABLE post_reports
  ADD CONSTRAINT check_report_category CHECK (category in (${ruleConcat}));
  `);
  await knex.raw(`--sql
  ALTER TABLE comment_reports
  ADD CONSTRAINT check_report_category CHECK (category in (${ruleConcat}));
  `);
}


export async function down(knex: Knex): Promise<void> {
  await knex.raw(`--sql
  ALTER TABLE post_reports DROP CONSTRAINT IF EXISTS check_report_category;
  `);
  await knex.raw(`--sql
  ALTER TABLE comment_reports DROP CONSTRAINT IF EXISTS check_report_category;
  `);
}
