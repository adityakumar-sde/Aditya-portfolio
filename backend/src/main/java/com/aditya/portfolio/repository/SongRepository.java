package com.aditya.portfolio.repository;

import com.aditya.portfolio.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song, Long>, JpaSpecificationExecutor<Song> {

    List<Song> findByEnabledTrueOrderByIdAsc();

    boolean existsByAudioUrl(String audioUrl);

    Optional<Song> findByAudioUrl(String audioUrl);

    List<Song> findByEnabledTrueAndMoodIgnoreCaseOrderByIdAsc(String mood);

    Optional<Song> findFirstByEnabledTrueAndIdGreaterThanOrderByIdAsc(Long id);

    Optional<Song> findFirstByEnabledTrueOrderByIdAsc();

    Optional<Song> findFirstByEnabledTrueAndIdLessThanOrderByIdDesc(Long id);

    Optional<Song> findFirstByEnabledTrueOrderByIdDesc();

    @Query("SELECT s FROM Song s WHERE s.enabled = true AND (" +
           "LOWER(s.language) LIKE LOWER(CONCAT('%', :lang, '%')) OR " +
           "LOWER(s.language) LIKE '%bihari%' OR LOWER(s.tags) LIKE '%bihari%') AND (" +
           "LOWER(s.era) LIKE '%old%' OR LOWER(s.era) LIKE '%classic%' OR " +
           "LOWER(s.genre) LIKE '%classic%' OR LOWER(s.tags) LIKE '%classic%') " +
           "ORDER BY s.id ASC")
    List<Song> findDefaultPreferredSongs(@Param("lang") String lang);

    @Query("SELECT s FROM Song s WHERE s.enabled = true AND " +
           "(LOWER(s.title) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           " LOWER(s.artist) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           " LOWER(s.album) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           " LOWER(s.language) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           " LOWER(s.genre) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           " LOWER(s.era) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           " LOWER(s.mood) LIKE LOWER(CONCAT('%', :kw, '%')) OR " +
           " LOWER(s.tags) LIKE LOWER(CONCAT('%', :kw, '%')))")
    List<Song> searchByKeyword(@Param("kw") String keyword);
}