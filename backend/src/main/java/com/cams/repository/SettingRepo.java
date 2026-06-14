package com.cams.repository;

import com.cams.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SettingRepo extends JpaRepository<Setting, Long> {}
