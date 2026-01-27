package com.fawry.blog.dto.post;

import jakarta.validation.constraints.Size;

public record PutRequest(
        @Size(min = 5, max = 100, message = "Title must be between 5 and 100 characters")
        String title,

        @Size(min = 10, message = "content must be less than 10")
        String content
) {}