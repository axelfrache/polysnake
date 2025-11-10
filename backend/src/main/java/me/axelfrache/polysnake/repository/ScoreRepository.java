package me.axelfrache.polysnake.repository;

import me.axelfrache.polysnake.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {

    @Query("SELECT s FROM Score s ORDER BY s.score DESC, s.createdAt ASC")
    List<Score> findTop10ByOrderByScoreDescCreatedAtAsc();

    @Query("SELECT s FROM Score s ORDER BY s.score DESC, s.createdAt ASC LIMIT 10")
    List<Score> findTopScores();
}
