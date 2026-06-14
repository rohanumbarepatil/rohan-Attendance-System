package com.cams.security;

import com.cams.entity.User;
import com.cams.repository.UserRepo;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtService jwtService;
  private final UserRepo userRepo;

  public JwtAuthFilter(JwtService jwtService, UserRepo userRepo) {
    this.jwtService = jwtService;
    this.userRepo = userRepo;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {
    String header = request.getHeader("Authorization");
    if (header != null && header.startsWith("Bearer ")) {
      try {
        Claims claims = jwtService.parse(header.substring(7));
        if (!jwtService.isRefreshToken(claims)) {
          Long userId = Long.valueOf(claims.getSubject());
          User user = userRepo.findById(userId).orElse(null);
          if (user != null && user.isActive()) {
            var auth = new UsernamePasswordAuthenticationToken(
                user, null, List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole())));
            SecurityContextHolder.getContext().setAuthentication(auth);
          }
        }
      } catch (Exception ignored) {
        // invalid token -> remain unauthenticated; entry point returns 401
      }
    }
    chain.doFilter(request, response);
  }
}

