package disertatie.eartrainer.service;

import disertatie.eartrainer.model.Multitracks;
import disertatie.eartrainer.model.Sample;
import disertatie.eartrainer.repo.MultitracksRepository;
import disertatie.eartrainer.repo.SampleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MultitracksService {

    public final MultitracksRepository repository;

    public Multitracks save(MultipartFile file, String instrType, Long melodyId) {
        Multitracks entity = new Multitracks();
        entity.setMelodyId(melodyId);
        entity.setInstrumentType(instrType);
        try {
            entity.setData(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return repository.save(entity);
    }

    public List<Multitracks> getByMelodyId(Long melodyId) {
        return repository.findAllByMelodyId(melodyId);
    }

    public Multitracks getByMelodyIdAndInstrumentType(Long melodyId, String instrumentType) {
        return repository.findByMelodyIdAndInstrumentType(melodyId, instrumentType);
    }

}
