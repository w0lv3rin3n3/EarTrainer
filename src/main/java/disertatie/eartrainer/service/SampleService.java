package disertatie.eartrainer.service;

import disertatie.eartrainer.model.Sample;
import disertatie.eartrainer.model.Users;
import disertatie.eartrainer.repo.SampleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class SampleService {

    public final SampleRepository repository;

    public List<Sample> get() {
        return repository.findAll();
    }

    public Sample get(Long id) {
        return repository.findFirstById(id);
    }

    public Sample save(MultipartFile file) {
        Sample entity = new Sample();
        entity.setFileName(file.getOriginalFilename());
        entity.setContentType(file.getContentType());
        try {
            entity.setData(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return repository.save(entity);
    }

    public Sample remove(Long id) {
        return repository.deleteSampleById(id);
    }
}
