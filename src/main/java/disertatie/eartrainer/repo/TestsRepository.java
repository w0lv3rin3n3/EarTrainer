package disertatie.eartrainer.repo;

import disertatie.eartrainer.model.Tests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestsRepository extends JpaRepository<Tests, Long> {
    Tests findFirstById(Long id);
    Tests deleteTestsById(Long id);
    Tests getTestsByTypeAndLevel(String type, Integer level);
}
