DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS logs;

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL,
  directions TEXT[]
);
  


CREATE TABLE logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY,
  recipe_id int,
  date_of_event DATE,
  notes TEXT NOT NULL,
  rating INTEGER NOT NULL
)
-- Our model is incomplete.
--  In order to provide a better user 
--  experience our recipes should include 
--  the ingredients needed for a recipes. 
--  Add an ingredients field, which is an array 
--  with amount, measurement, 
-- and name (use a JSONB column).