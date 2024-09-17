package disertatie.eartrainer.web;

import disertatie.eartrainer.model.Sample;
import disertatie.eartrainer.service.SampleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class SampleController {

    private final SampleService sampleService;

    @GetMapping("/samples")
    public List<Sample> get() {
        return sampleService.get();
    }

    @GetMapping("/samples/{id}")
    public Sample getSample(@PathVariable Long id) {
        Sample sample = sampleService.get(id);
        if (sample == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return sample;
    }

    @GetMapping("/samples/{id}/data")
    public byte[] getSampleData(@PathVariable Long id) {
        Sample sample = sampleService.get(id);
        if (sample == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return sample.getData();
    }

    @DeleteMapping("/samples/delete/{id}")
    public void delete(@PathVariable Long id) {
        Sample sample = sampleService.remove(id);
        if (sample == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/samples/addsample")
    public Sample create(@RequestPart("data") MultipartFile file) throws IOException {
        return sampleService.save(file);
    }
}
