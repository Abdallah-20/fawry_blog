package com.fawry.blog.dto;

public record Response<T>(String message, T result) {
}
