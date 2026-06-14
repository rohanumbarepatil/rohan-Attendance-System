package com.cams.controller;

import com.cams.entity.Notification;
import com.cams.service.NotificationService;
import com.cams.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
  private final NotificationService notificationService;

  @GetMapping
  public ResponseEntity<List<Notification>> getNotifications(@RequestParam(required = false) List<String> audiences) {
    Long userId = CurrentUser.get().getId();
    if (audiences == null) {
      audiences = java.util.Collections.emptyList();
    }
    return ResponseEntity.ok(notificationService.getUserNotifications(userId, audiences));
  }

  @PutMapping("/{id}/read")
  public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
    notificationService.markAsRead(id);
    return ResponseEntity.ok().build();
  }
}
