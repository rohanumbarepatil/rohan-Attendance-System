package com.cams.service;

import com.cams.entity.User;
import com.cams.repository.UserRepo;
import com.cams.web.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepo userRepo;
  private final PasswordEncoder passwordEncoder;

  public List<User> getAllUsers() {
    return userRepo.findAll();
  }

  public User getUserById(Long id) {
    return userRepo.findById(id)
        .orElseThrow(() -> new ApiException(404, "USER_NOT_FOUND", "User not found"));
  }

  public User createUser(User user) {
    if (userRepo.findByEmail(user.getEmail()).isPresent()) {
      throw new ApiException(400, "EMAIL_EXISTS", "Email already in use");
    }
    String rawPassword = (user.getPassword() != null && !user.getPassword().isBlank()) ? user.getPassword() : "Default@123";
    user.setPassword(passwordEncoder.encode(rawPassword));
    return userRepo.save(user);
  }

  public User updateUser(Long id, User updateRequest) {
    User existing = getUserById(id);
    existing.setDisplayName(updateRequest.getDisplayName());
    existing.setPhone(updateRequest.getPhone());
    existing.setRole(updateRequest.getRole());
    existing.setActive(updateRequest.isActive());
    if (updateRequest.getPassword() != null && !updateRequest.getPassword().isBlank()) {
      existing.setPassword(passwordEncoder.encode(updateRequest.getPassword()));
    }
    return userRepo.save(existing);
  }

  public void deleteUser(Long id) {
    userRepo.deleteById(id);
  }
}

