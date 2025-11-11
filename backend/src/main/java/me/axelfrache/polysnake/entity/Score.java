package me.axelfrache.polysnake.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "scores", indexes = {
    @Index(name = "idx_username_gamemode", columnList = "username,gameMode", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false)
    private Integer score;
    
    @Column(nullable = false, length = 20)
    private String gameMode; // "classic" or "chaos"

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
