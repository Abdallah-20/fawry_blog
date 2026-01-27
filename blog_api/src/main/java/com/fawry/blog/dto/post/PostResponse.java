package com.fawry.blog.dto.post;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record PostResponse(
        Long id,
        String title,
        String content,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
        LocalDateTime createdAt,
        String authorName
) {}