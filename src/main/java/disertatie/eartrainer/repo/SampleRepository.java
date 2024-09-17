package disertatie.eartrainer.repo;

import disertatie.eartrainer.model.Sample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SampleRepository extends JpaRepository<Sample, Long> {
    Sample findFirstById(Long id);
    Sample deleteSampleById(Long id);
}
