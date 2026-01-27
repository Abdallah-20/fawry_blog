package com.fawry.blog.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @Email(message = "Invalid email format")
        String email,

        @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
        String username,

        @Size(min = 6, message = "Password must be at least 6 characters")
        String password,

        @Size(min = 3, message = "name must be at least 3 characters")
        String name
) {}