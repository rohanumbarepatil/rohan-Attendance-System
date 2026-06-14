package com.cams.controller;

import com.cams.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest req) {
    return ResponseEntity.ok(authService.login(req.getEmail(), req.getPassword()));
  }

  @PostMapping("/refresh")
  public ResponseEntity<Map<String, String>> refresh(@RequestBody RefreshRequest req) {
    return ResponseEntity.ok(authService.refreshToken(req.getRefreshToken()));
  }

  @Data
  public static class LoginRequest {
    private String email;
    private String password;
  }

  @Data
  public static class RefreshRequest {
    private String refreshToken;
  }
}
