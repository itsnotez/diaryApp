package com.mindlog.backend.domain.diary.controller;

import com.mindlog.backend.domain.diary.entity.Diary;
import com.mindlog.backend.domain.diary.repository.DiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diaries")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Allow Frontend
public class DiaryController {

    private final DiaryRepository diaryRepository;

    @GetMapping
    public List<Diary> getAllDiaries() {
        // TODO: Get userId from Security Context
        Long dummyUserId = 1L;
        return diaryRepository.findAllByUserIdOrderByCreatedAtDesc(dummyUserId);
    }

    @PostMapping
    public Diary createDiary(@RequestBody Diary diary) {
        // TODO: Set userId from Security Context
        Long dummyUserId = 1L;
        diary = Diary.builder()
                .userId(dummyUserId)
                .content(diary.getContent())
                .moodScore(diary.getMoodScore())
                .weather(diary.getWeather())
                .temperature(diary.getTemperature())
                .location(diary.getLocation())
                .build();
        return diaryRepository.save(diary);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Diary> getDiary(@PathVariable Long id) {
        // TODO: Get userId from Security Context
        return diaryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
