package disertatie.eartrainer.repo;

import disertatie.eartrainer.model.Melodies;
import disertatie.eartrainer.model.Multitracks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MelodiesRepository extends JpaRepository<Melodies, Long> {
    List<Melodies> findAllByLevelGreaterThanEqual(Integer level);
}
