package disertatie.eartrainer.service;

import disertatie.eartrainer.model.Answers;
import disertatie.eartrainer.repo.AnswersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnswersService {

    public final AnswersRepository repository;

    public List<Answers> getAll() {
        log.info("///////////////////getAll() Answers service");
        return repository.findAll();
    }

    public List<Answers> getAllAnswersByUserIdAndTypeAndLevel(Long user_id, String type, Integer level) {
        log.info("///////////////////getAllAnswersByUserIdAndType() Answers service");
        return repository.findAllByUserIdAndTypeAndLevel(user_id, type, level);
    }

    public List<Answers> getAllAnswersByType(String type) {
        log.info("///////////////////getAllAnswersByType() Answers service");
        return repository.findAllByType(type);
    }

    public Answers save(Answers data) {
        Answers entity = new Answers();
        entity.setUserId(data.getUserId());
        entity.setExercise(data.getExercise());
        entity.setLevel(data.getLevel());
        entity.setUserInput(data.getUserInput());
        entity.setType(data.getType());
        entity.setScore(data.getScore());
        entity.setDate_time(LocalDateTime.now());
        return repository.save(entity);
    }

    public Answers remove(Long id) {
        return repository.deleteTestsById(id);
    }
}
