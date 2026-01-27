package com.fawry.blog.dto.user;

public record UserResponse(
        Long id,
        String email,
        String username,
        String name
) {}
