package com.fawry.blog.dto.post;

import com.fawry.blog.entity.User;

public record ReactionResponse(Boolean isLike, String userName) {
}
