package com.fawry.blog.security;

import com.fawry.blog.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository; // Dependency: Database Access

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String Username) throws UsernameNotFoundException {
        return userRepository.findByUsername(Username)
                .map(user -> new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(),
                        Collections.emptyList() // Add roles/authorities here later
                ))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + Username));
    }
}