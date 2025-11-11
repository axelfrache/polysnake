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
        
        // Chercher si l'utilisateur existe déjà pour ce mode de jeu
        Score score = scoreRepository.findByUsernameAndGameMode(request.getUsername(), request.getGameMode())
                .map(existingScore -> {
                    // Anti-triche : vérifier que l'utilisateur ne spam pas
                    Duration timeSinceLastUpdate = Duration.between(existingScore.getCreatedAt(), LocalDateTime.now());
                    if (timeSinceLastUpdate.toSeconds() < 10) {
                        log.warn("User {} is submitting scores too quickly ({}s since last update)", 
                                request.getUsername(), timeSinceLastUpdate.toSeconds());
                        throw new IllegalArgumentException("Please wait at least 10 seconds between score submissions");
                    }
                    
                    // Si le nouveau score est meilleur, mettre à jour
                    if (request.getScore() > existingScore.getScore()) {
                        log.info("Updating score for user: {} in {} mode from {} to {}", 
                                request.getUsername(), request.getGameMode(), existingScore.getScore(), request.getScore());
                        existingScore.setScore(request.getScore());
                        return existingScore;
                    } else {
                        log.info("Keeping existing score for user: {} in {} mode (existing: {}, new: {})", 
                                request.getUsername(), request.getGameMode(), existingScore.getScore(), request.getScore());
                        return existingScore;
                    }
                })
                .orElseGet(() -> {
                    // Créer un nouveau score si l'utilisateur n'existe pas pour ce mode
                    log.info("Creating new score entry for user: {} in {} mode", request.getUsername(), request.getGameMode());
                    return Score.builder()
                            .username(request.getUsername())
                            .score(request.getScore())
                            .gameMode(request.getGameMode())
                            .build();
                });
        
        Score savedScore = scoreRepository.save(score);
        log.info("Score saved successfully with ID: {}", savedScore.getId());
        
        return mapToResponse(savedScore);
    }

    @Transactional(readOnly = true)
    public List<ScoreResponse> getTopScores(String gameMode) {
        log.info("Fetching top 10 scores for {} mode", gameMode);
        List<Score> scores = scoreRepository.findTopScoresByGameMode(gameMode);
        return scores.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ScoreResponse mapToResponse(Score score) {
        return ScoreResponse.builder()
                .id(score.getId())
                .username(score.getUsername())
                .score(score.getScore())
                .gameMode(score.getGameMode())
                .createdAt(score.getCreatedAt())
                .build();
    }
}
