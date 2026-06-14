package com.cams.service;

import com.cams.entity.User;
import com.cams.repository.UserRepo;
import com.cams.security.JwtService;
import com.cams.web.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepo userRepo;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;

  public Map<String, String> login(String email, String password) {
    User user = userRepo.findByEmail(email)
        .orElseThrow(() -> new ApiException(401, "INVALID_CREDENTIALS", "Invalid email or password"));

    if (!user.isActive()) {
      throw new ApiException(403, "ACCOUNT_DISABLED", "Account is disabled");
    }

    boolean match = passwordEncoder.matches(password, user.getPassword());

    if (!match) {
      throw new ApiException(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    String accessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
    String refreshToken = jwtService.generateRefreshToken(user.getId());

    return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
  }

  public Map<String, String> refreshToken(String refreshTokenStr) {
    var claims = jwtService.parse(refreshTokenStr);
    if (!jwtService.isRefreshToken(claims)) {
      throw new ApiException(401, "INVALID_TOKEN", "Not a refresh token");
    }

    Long userId = Long.valueOf(claims.getSubject());
    User user = userRepo.findById(userId)
        .orElseThrow(() -> new ApiException(404, "USER_NOT_FOUND", "User not found"));

    if (!user.isActive()) {
      throw new ApiException(403, "ACCOUNT_DISABLED", "Account is disabled");
    }

    String newAccessToken = jwtService.generateAccessToken(user.getId(), user.getEmail(), user.getRole());
    String newRefreshToken = jwtService.generateRefreshToken(user.getId());

    return Map.of("accessToken", newAccessToken, "refreshToken", newRefreshToken);
  }
}
