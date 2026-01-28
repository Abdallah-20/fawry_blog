package com.fawry.blog.dto.user;

public record RegisterRequest(
        String name,
        String email,
        String password,
        String confirmPassword
) {
}
