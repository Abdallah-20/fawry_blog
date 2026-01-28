package com.fawry.blog.dto.post;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fawry.blog.entity.Reaction;

import java.time.LocalDateTime;
import java.util.List;

public record PostResponse(
        Long id,
        String title,
        String content,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime createdAt,
        String authorName,
        List<ReactionResponse> reactions
) {}