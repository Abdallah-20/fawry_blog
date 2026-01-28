package com.fawry.blog.service;

import com.fawry.blog.dto.user.RegisterRequest;
import com.fawry.blog.dto.user.UserRequest;
import com.fawry.blog.dto.user.UserResponse;
import com.fawry.blog.dto.user.UserUpdateRequest;
import com.fawry.blog.entity.User;
import com.fawry.blog.exception.DuplicateResourceException;
import com.fawry.blog.exception.ResourceNotFoundException;
import com.fawry.blog.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Spring Transaction Management

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email '" + request.email() + "' is already registered!");        }
        if (userRepository.existsByUsername(request.name())) {
            throw new DuplicateResourceException("Username '" + request.name() + "' is already taken!");        }

        User user = new User();
        user.setEmail(request.email());
        user.setUsername(request.name());
        user.setName(request.name());
        if(request.password().equals(request.confirmPassword())) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }else {
            throw new RuntimeException("The passowrd dosen't match");
        }


        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return mapToResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return mapToResponse(user);
    }

    // UPDATE
    public UserResponse updateUser(String userName, UserUpdateRequest request) {
        User user = userRepository.findByUsername(userName)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with: " + userName));


        if (request.username() != null && !request.username().isBlank()) {
            if (!user.getUsername().equals(request.username()) && userRepository.existsByUsername(request.username())) {
                throw new DuplicateResourceException("New username '" + request.username() + "' is already taken!");
            }
            user.setUsername(request.username());
        }


        if (request.email() != null && !request.email().isBlank()) {
            if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
                throw new DuplicateResourceException("New email '" + request.email() + "' is already taken!");
            }
            user.setEmail(request.email());
        }


        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }


        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        User savedUser = userRepository.save(user);
        return mapToResponse(savedUser);
    }


    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        userRepository.delete(user);
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getName()
        );
    }
}