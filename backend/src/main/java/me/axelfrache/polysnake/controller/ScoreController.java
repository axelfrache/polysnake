package me.axelfrache.polysnake.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.axelfrache.polysnake.dto.ScoreRequest;
import me.axelfrache.polysnake.dto.ScoreResponse;
import me.axelfrache.polysnake.service.ScoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;

    @PostMapping
    public ResponseEntity<ScoreResponse> saveScore(@Valid @RequestBody ScoreRequest request) {
        log.info("Received request to save score for user: {}", request.getUsername());
        ScoreResponse response = scoreService.saveScore(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/top")
    public ResponseEntity<List<ScoreResponse>> getTopScores(
            @RequestParam(defaultValue = "classic") String gameMode) {
        log.info("Received request to get top scores for {} mode", gameMode);
        List<ScoreResponse> scores = scoreService.getTopScores(gameMode);
        return ResponseEntity.ok(scores);
    }
}
