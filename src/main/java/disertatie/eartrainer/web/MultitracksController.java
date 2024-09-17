package disertatie.eartrainer.web;

import disertatie.eartrainer.model.Multitracks;
import disertatie.eartrainer.model.Sample;
import disertatie.eartrainer.service.MultitracksService;
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
public class MultitracksController {

    private final MultitracksService multitracksService;

    @PostMapping("/multitracks/add-track")
    public Multitracks create(@RequestPart("data") MultipartFile file, @RequestParam Long melodyId, @RequestParam String instrumentType) throws IOException {
        return multitracksService.save(file, instrumentType, melodyId);
    }

    @GetMapping("/multitracks/{melodyId}/{instrumentType}/data")
    public byte[] getTrackData(@PathVariable Long melodyId, @PathVariable String instrumentType) {
        Multitracks track = multitracksService.getByMelodyIdAndInstrumentType(melodyId, instrumentType);
        if (track == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return track.getData();
    }

    @GetMapping("/multitracks/{melodyId}")
    public List<Multitracks> getByName(@PathVariable Long melodyId) {
        List<Multitracks> multitracks = multitracksService.getByMelodyId(melodyId);
        if (multitracks == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return multitracks;
    }

}
