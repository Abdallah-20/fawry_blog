package com.fawry.blog.repository;

import com.fawry.blog.dto.post.CommentResponse;
import com.fawry.blog.entity.Comment;
import com.fawry.blog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);;
}