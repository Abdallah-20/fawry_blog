package com.fawry.blog.repository;

import com.fawry.blog.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    Optional<Reaction> findByUserIdAndPostId(Long userId, Long postId);

    long countByPostIdAndIsLikeTrue(Long postId);
    long countByPostIdAndIsLikeFalse(Long postId);
}
