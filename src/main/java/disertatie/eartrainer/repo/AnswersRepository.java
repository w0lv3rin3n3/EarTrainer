package disertatie.eartrainer.repo;

import disertatie.eartrainer.model.Answers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswersRepository extends JpaRepository<Answers, Long> {
    Answers findFirstById(Long id);
    Answers deleteTestsById(Long id);
    List<Answers> findAllByType(String type);
    List<Answers> findAllByUserIdAndType(Long userId, String type);
    List<Answers> findAllByUserIdAndTypeAndLevel(Long userId, String type, Integer level);
}
