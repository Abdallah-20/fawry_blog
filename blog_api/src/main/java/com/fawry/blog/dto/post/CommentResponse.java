package com.fawry.blog.dto.post;

public record CommentResponse(
        String username,
        Long postId,
        String content
) {}
