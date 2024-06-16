

const funcName = "get_author";

exports.up = async function (knex) {


  await knex.raw(`DROP FUNCTION IF EXISTS ${funcName}(integer, integer) CASCADE;`);


  await knex.raw(`--sql
CREATE OR REPLACE FUNCTION ${funcName}(uid integer, bid integer)
RETURNS TABLE (j json)
LANGUAGE plpgsql AS
$$
BEGIN
  RETURN QUERY
  SELECT json_build_object(
  'id', u.id,
  'board_id', b.id,
  'default_nickname', b.default_nickname,
  'default_avatar_path', b.default_avatar_path,
  'use_flair', b.use_flair,
  'nickname', bu.nickname,
  'avatar_path', bu.avatar_path,
  'flairs', (SELECT COALESCE(ARRAY_TO_JSON(ARRAY_AGG(flairs ORDER BY flairs.box_id ASC, flairs.rank ASC NULLS LAST)), '[]'::JSON)
            FROM x_board_user_flair AS xbf
            LEFT JOIN flairs ON flairs.id = xbf.flair_id
            WHERE xbf.board_user_id = bu.id),
  'is_manager', (bm.id IS NOT NULL),
  'deleted_at', u.deleted_at,
  'temp_id', (u.id + b.id + EXTRACT(EPOCH FROM (u.created_at))::integer) % 1000
  )::json
  FROM users u
  LEFT JOIN boards b on b.id = bid
  LEFT JOIN board_users bu on bu.user_id = uid AND bu.board_id = bid
  LEFT JOIN board_managers bm on bm.user_id = uid AND bm.board_id = bid
  WHERE u.id = uid;
END;
$$;`);
};

//  LEFT JOIN board_managers bm ON u.id = bm.user_id AND bm.board_id = bid
exports.down = function (knex) {
  return knex.raw(`DROP FUNCTION IF EXISTS ${funcName}(integer, integer) CASCADE;`);
};

