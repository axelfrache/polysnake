package me.axelfrache.polysnake.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.axelfrache.polysnake.dto.ScoreRequest;
import me.axelfrache.polysnake.dto.ScoreResponse;
import me.axelfrache.polysnake.entity.Score;
import me.axelfrache.polysnake.repository.ScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepository;

    @Transactional
    public ScoreResponse saveScore(ScoreRequest request) {
        log.info("Saving score for user: {} with score: {}", request.getUsername(), request.getScore());
        
        if (request.getScore() > 10000) {
            log.warn("Suspicious score detected for user: {} with score: {}", 
                    request.getUsername(), request.getScore());
            throw new IllegalArgumentException("Score is suspiciously high. Maximum allowed: 10000");
        }
        
        Score score = scoreRepository.findByUsername(request.getUsername())
                .map(existingScore -> {
                    Duration timeSinceLastUpdate = Duration.between(existingScore.getCreatedAt(), LocalDateTime.now());
                    if (timeSinceLastUpdate.toSeconds() < 10) {
                        log.warn("User {} is submitting scores too quickly ({}s since last update)", 
                                request.getUsername(), timeSinceLastUpdate.toSeconds());
                        throw new IllegalArgumentException("Please wait at least 10 seconds between score submissions");
                    }
                    
                    if (request.getScore() > existingScore.getScore()) {
                        log.info("Updating score for user: {} from {} to {}", 
                                request.getUsername(), existingScore.getScore(), request.getScore());
                        existingScore.setScore(request.getScore());
                        return existingScore;
                    } else {
                        log.info("Keeping existing score for user: {} (existing: {}, new: {})", 
                                request.getUsername(), existingScore.getScore(), request.getScore());
                        return existingScore;
                    }
                })
                .orElseGet(() -> {
                    log.info("Creating new score entry for user: {}", request.getUsername());
                    return Score.builder()
                            .username(request.getUsername())
                            .score(request.getScore())
                            .build();
                });
        
        Score savedScore = scoreRepository.save(score);
        log.info("Score saved successfully with ID: {}", savedScore.getId());
        
        return mapToResponse(savedScore);
    }

    @Transactional(readOnly = true)
    public List<ScoreResponse> getTopScores() {
        log.info("Fetching top 10 scores");
        List<Score> scores = scoreRepository.findTopScores();
        return scores.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ScoreResponse mapToResponse(Score score) {
        return ScoreResponse.builder()
                .id(score.getId())
                .username(score.getUsername())
                .score(score.getScore())
                .createdAt(score.getCreatedAt())
                .build();
    }
}
