package com.mindlog.backend.domain.diary.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "diaries")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Diary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId; // For now simple ID. Later link to User entity.

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content; // Client-side Encrypted String

    @JsonProperty("mood_score")
    private Integer moodScore;
    
    private String weather;

    private Double temperature;
    
    private String location;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
