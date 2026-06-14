package com.cams.service;

import com.cams.entity.Notification;
import com.cams.repository.NotificationRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
  private final NotificationRepo notificationRepo;
  private final SimpMessagingTemplate messagingTemplate;

  public Notification sendNotification(Notification notification) {
    if (notification.getCreatedAt() == null) {
      notification.setCreatedAt(Instant.now());
    }
    Notification saved = notificationRepo.save(notification);

    if (saved.getUserId() != null) {
      messagingTemplate.convertAndSendToUser(
          String.valueOf(saved.getUserId()),
          "/queue/notifications",
          saved
      );
    } else if (saved.getAudience() != null) {
      messagingTemplate.convertAndSend(
          "/topic/notifications/" + saved.getAudience(),
          saved
      );
    }

    return saved;
  }

  public List<Notification> getUserNotifications(Long userId, List<String> audiences) {
    return notificationRepo.findTop50ByUserIdOrAudienceInOrderByCreatedAtDesc(userId, audiences);
  }

  public void markAsRead(Long id) {
    notificationRepo.findById(id).ifPresent(n -> {
      n.setRead(true);
      notificationRepo.save(n);
    });
  }
}

