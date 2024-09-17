package disertatie.eartrainer.service;

import disertatie.eartrainer.model.Melodies;
import disertatie.eartrainer.model.Multitracks;
import disertatie.eartrainer.model.Sample;
import disertatie.eartrainer.repo.MelodiesRepository;
import disertatie.eartrainer.repo.MultitracksRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MelodiesService {

    public final MelodiesRepository repository;

    public List<Melodies> get() {
        return repository.findAll();
    }

    public List<Melodies> getByLevel(Integer level) {
        return repository.findAllByLevelGreaterThanEqual(level);
    }

    public Melodies save(Melodies data) {
        Melodies entity = new Melodies();
        entity.setFileName(data.getFileName());
        entity.setLevel(data.getLevel());
        return repository.save(entity);
    }

}
