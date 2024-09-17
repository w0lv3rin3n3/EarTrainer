package disertatie.eartrainer.repo;

import disertatie.eartrainer.model.Multitracks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MultitracksRepository extends JpaRepository<Multitracks, Long> {

//    @Query(value = "SELECT melodyName, level from Multitracks where level > :level group by melodyName")
//    List<Multitracks> findByLevelGreaterThan(@Param("level") Integer level);

    List<Multitracks> findAllByMelodyId(Long melodyId);
    Multitracks findByMelodyIdAndInstrumentType(Long melodyId, String instrumentType);
}
