DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS logs;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  directions TEXT[],
  ingredients JSONB[]
);
  


-- CREATE TABLE logs (
--   id BIGINT GENERATED ALWAYS AS IDENTITY,
--   -- recipe_id BIGINT NOT NULL REFERENCES recipe(id),
--   recipe_id int,
--   date_of_event DATE,
--   notes TEXT NOT NULL,
--   rating INTEGER NOT NULL
-- )
CREATE TABLE logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date_of_event TEXT NOT NULL,
  notes TEXT NOT NULL,
  rating BIGINT NOT NULL,
  recipe_id BIGINT REFERENCES recipes(id)
);
-- Our model is incomplete.
--  In order to provide a better user 
--  experience our recipes should include 
--  the ingredients needed for a recipes. 
--  Add an ingredients field, which is an array 
--  with amount, measurement, 
-- and name (use a JSONB column).