\c nc_games_test

INSERT INTO comments (body, author, review_id) VALUES ('Nice', 'mallionaire', 3) RETURNING * 