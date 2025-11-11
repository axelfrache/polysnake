package me.axelfrache.polysnake.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ScoreRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 50, message = "Username must be between 2 and 50 characters")
    private String username;

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score must be positive")
    @Max(value = 10000, message = "Score is suspiciously high (max: 10000)")
    private Integer score;
    
    @NotBlank(message = "Game mode is required")
    private String gameMode; // "classic" or "chaos"
}
