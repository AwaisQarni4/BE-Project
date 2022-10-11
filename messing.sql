\c nc_games_test
SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comments.comment_id) AS comment_count
FROM reviews 
LEFT JOIN comments 
ON reviews.review_id = comments.review_id 
WHERE reviews.review_id = 3
GROUP BY reviews.review_id;