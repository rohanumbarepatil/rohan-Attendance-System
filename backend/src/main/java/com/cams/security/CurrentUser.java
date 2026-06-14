package com.cams.security;

import com.cams.entity.User;
import com.cams.web.ApiException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** Helper to access the authenticated user anywhere in the service layer. */
public final class CurrentUser {
  private CurrentUser() {}

  public static User get() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof User user)) {
      throw new ApiException(401, "UNAUTHENTICATED", "Authentication required.");
    }
    return user;
  }

  public static boolean hasRole(String role) {
    return get().getRole().equals(role);
  }
}
