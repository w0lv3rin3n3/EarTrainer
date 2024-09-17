package disertatie.eartrainer.service;

import disertatie.eartrainer.model.Sample;
import disertatie.eartrainer.model.Tests;
import disertatie.eartrainer.repo.SampleRepository;
import disertatie.eartrainer.repo.TestsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestsService {

    public final TestsRepository repository;

    public List<Tests> getAll() {
        return repository.findAll();
    }

    public Tests getTestsByLevel(String type, Integer level) {
        return repository.getTestsByTypeAndLevel(type, level);
    }

    public Tests save(Tests data) {
        Tests entity = new Tests();
        entity.setLevel(data.getLevel());
        entity.setType(data.getType());
        entity.setExercise(data.getExercise());
        return repository.save(entity);
    }

    public Tests remove(Long id) {
        return repository.deleteTestsById(id);
    }
}
