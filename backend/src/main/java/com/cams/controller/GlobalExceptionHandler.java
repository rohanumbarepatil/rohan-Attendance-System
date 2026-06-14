package com.cams.controller;

import com.cams.web.ApiException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ApiException.class)
  public ResponseEntity<Map<String, Object>> handleApiException(ApiException e) {
    return ResponseEntity.status(e.getStatus())
        .body(Map.of(
            "error", true,
            "code", e.getCode(),
            "message", e.getMessage()
        ));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleException(Exception e) {
    e.printStackTrace();
    return ResponseEntity.status(500)
        .body(Map.of(
            "error", true,
            "code", "INTERNAL_ERROR",
            "message", "An unexpected error occurred."
        ));
  }
}
