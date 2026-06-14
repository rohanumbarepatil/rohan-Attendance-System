package com.cams;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CamsApplication {
  public static void main(String[] args) {
    SpringApplication.run(CamsApplication.class, args);
  }
}
