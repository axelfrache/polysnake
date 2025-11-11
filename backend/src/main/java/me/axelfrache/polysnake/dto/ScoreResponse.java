package me.axelfrache.polysnake.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreResponse {
    private Long id;
    private String username;
    private Integer score;
    private String gameMode;
    private LocalDateTime createdAt;
}
