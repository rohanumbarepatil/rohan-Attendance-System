package com.cams.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {
  private final SecretKey key;
  private final long accessExpMinutes;
  private final long refreshExpDays;

  public JwtService(
      @Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.access-exp-minutes}") long accessExpMinutes,
      @Value("${app.jwt.refresh-exp-days}") long refreshExpDays) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessExpMinutes = accessExpMinutes;
    this.refreshExpDays = refreshExpDays;
  }

  public String generateAccessToken(Long userId, String email, String role) {
    return build(userId, Map.of("email", email, "role", role, "typ", "access"),
        Duration.ofMinutes(accessExpMinutes));
  }

  public String generateRefreshToken(Long userId) {
    return build(userId, Map.of("typ", "refresh"), Duration.ofDays(refreshExpDays));
  }

  private String build(Long userId, Map<String, ?> claims, Duration ttl) {
    Instant now = Instant.now();
    return Jwts.builder()
        .subject(String.valueOf(userId))
        .claims(claims)
        .issuedAt(Date.from(now))
        .expiration(Date.from(now.plus(ttl)))
        .signWith(key)
        .compact();
  }

  /** Throws JwtException on invalid/expired tokens. */
  public Claims parse(String token) {
    return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
  }

  public boolean isRefreshToken(Claims claims) {
    return "refresh".equals(claims.get("typ", String.class));
  }
}
