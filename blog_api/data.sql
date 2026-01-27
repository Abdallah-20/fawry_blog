-- ============================================================================
-- Insert Sample Users
-- ============================================================================

INSERT INTO users (email, username, password, name) VALUES
('john.doe@example.com', 'johndoe', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'John Doe'),
('jane.smith@example.com', 'janesmith', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Jane Smith'),
('bob.wilson@example.com', 'bobwilson', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Bob Wilson'),
('alice.brown@example.com', 'alicebrown', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Alice Brown'),
('charlie.davis@example.com', 'charliedavis', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Charlie Davis');

-- ============================================================================
-- Insert Sample Posts
-- ============================================================================

INSERT INTO posts (title, content, user_id) VALUES
(
    'Getting Started with PostgreSQL',
    'PostgreSQL is a powerful, open-source object-relational database system. In this post, I will share my experience learning PostgreSQL and some best practices I discovered along the way.',
    1
),
(
    'Building RESTful APIs with Spring Boot',
    'Spring Boot makes it incredibly easy to build production-ready REST APIs. Here are some tips and tricks for creating robust and scalable APIs using Spring Boot framework.',
    2
),
(
    'Understanding JPA Entity Relationships',
    'JPA provides various ways to map entity relationships. In this comprehensive guide, we will explore OneToMany, ManyToOne, OneToOne, and ManyToMany relationships with practical examples.',
    1
),
(
    'Best Practices for Database Design',
    'Good database design is crucial for application performance and maintainability. Let me share some fundamental principles and best practices I have learned over the years.',
    3
),
(
    'Introduction to Microservices Architecture',
    'Microservices architecture has become increasingly popular. In this article, I discuss the benefits, challenges, and key considerations when adopting microservices.',
    4
),
(
    'Securing Your Spring Boot Application',
    'Security should never be an afterthought. Here are essential security practices every Spring Boot developer should implement in their applications.',
    2
);

-- ============================================================================
-- Insert Sample Comments
-- ============================================================================

INSERT INTO comments (content, user_id, post_id) VALUES
('Great post! Very helpful for beginners.', 2, 1),
('Thanks for sharing this. I learned a lot!', 3, 1),
('Could you elaborate more on indexing strategies?', 4, 1),
('Excellent explanation of REST principles.', 1, 2),
('I have been looking for this kind of tutorial. Thanks!', 5, 2),
('This is exactly what I needed for my project.', 3, 3),
('Very comprehensive guide. Bookmarked for future reference!', 4, 3),
('The relationship examples are very clear. Great work!', 5, 3),
('Normalization is key! Good points made here.', 2, 4),
('What about denormalization for read-heavy applications?', 5, 4),
('Microservices can be complex. Any tips on when NOT to use them?', 1, 5),
('Service discovery and load balancing are crucial. Nice article!', 3, 5),
('Security is paramount. Thanks for these practical tips!', 1, 6),
('Do you have examples for OAuth2 implementation?', 4, 6);

-- ============================================================================
-- Insert Sample Reactions
-- ============================================================================

INSERT INTO reactions (is_like, user_id, post_id) VALUES
(true, 2, 1),
(true, 3, 1),
(true, 4, 1),
(true, 5, 1),
(true, 1, 2),
(true, 3, 2),
(true, 4, 2),
(false, 5, 2),
(true, 2, 3),
(true, 4, 3),
(true, 5, 3),
(true, 1, 4),
(true, 2, 4),
(true, 5, 4),
(true, 1, 5),
(true, 2, 5),
(true, 3, 5),
(false, 4, 5),
(true, 1, 6),
(true, 3, 6),
(true, 4, 6),
(true, 5, 6);

-- ============================================================================
-- Verify Data Insertion
-- ============================================================================

-- Count records
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM posts) as total_posts,
    (SELECT COUNT(*) FROM comments) as total_comments,
    (SELECT COUNT(*) FROM reactions) as total_reactions;

-- Sample query: Posts with engagement stats
SELECT 
    p.id,
    p.title,
    u.username as author,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT r.id) as reaction_count,
    SUM(CASE WHEN r.is_like = true THEN 1 ELSE 0 END) as likes,
    SUM(CASE WHEN r.is_like = false THEN 1 ELSE 0 END) as dislikes
FROM posts p
JOIN users u ON p.user_id = u.id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN reactions r ON p.id = r.post_id
GROUP BY p.id, p.title, u.username
ORDER BY p.created_at DESC;
