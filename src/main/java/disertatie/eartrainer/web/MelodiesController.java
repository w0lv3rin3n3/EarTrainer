package disertatie.eartrainer.web;

import disertatie.eartrainer.model.Melodies;
import disertatie.eartrainer.model.Multitracks;
import disertatie.eartrainer.service.MelodiesService;
import disertatie.eartrainer.service.MultitracksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MelodiesController {

    private final MelodiesService melodiesService;

    @GetMapping("/melodies")
    public List<Melodies> get() {return melodiesService.get();}

    @GetMapping("/melodies/{level}")
    public List<Melodies> getByLevel(@PathVariable Integer level) {return melodiesService.getByLevel(level);}

    @PostMapping("/melodies/add-melody")
    public void add(@RequestBody Melodies data) {
        melodiesService.save(data);
    }

}
