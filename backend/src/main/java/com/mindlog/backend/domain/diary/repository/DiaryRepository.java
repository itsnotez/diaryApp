package com.mindlog.backend.domain.diary.repository;

import com.mindlog.backend.domain.diary.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiaryRepository extends JpaRepository<Diary, Long> {
    List<Diary> findAllByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Diary> findByIdAndUserId(Long id, Long userId);
}
