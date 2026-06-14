package com.cams.repository;

import com.cams.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findTop50ByUserIdOrAudienceInOrderByCreatedAtDesc(Long userId, List<String> audiences);
  }
