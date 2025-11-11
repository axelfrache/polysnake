package me.axelfrache.polysnake.repository;

import me.axelfrache.polysnake.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {

    @Query("SELECT s FROM Score s WHERE s.gameMode = :gameMode ORDER BY s.score DESC, s.createdAt ASC LIMIT 10")
    List<Score> findTopScoresByGameMode(String gameMode);
    
    Optional<Score> findByUsernameAndGameMode(String username, String gameMode);
}
