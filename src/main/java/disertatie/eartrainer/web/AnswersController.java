package disertatie.eartrainer.web;

import disertatie.eartrainer.model.Answers;
import disertatie.eartrainer.service.AnswersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class AnswersController {

    private final AnswersService answersService;

    @GetMapping("/answers")
    public List<Answers> getAll() {
        log.info("=======================getAll() Answers CONTROLLER///////////////////");
        return answersService.getAll();
    }

    @GetMapping("/answers/{type}")
    public List<Answers> getAnswersByType(@PathVariable String type) {
        return answersService.getAllAnswersByType(type);
    }

    @GetMapping("/answers/{userId}/{type}/{level}")
    public List<Answers> getAnswersByUserId(@PathVariable Long userId, @PathVariable String type, @PathVariable Integer level) {
        return answersService.getAllAnswersByUserIdAndTypeAndLevel(userId, type, level);
    }

    @DeleteMapping("/answers/delete/{id}")
    public void delete(@PathVariable Long id) {
        Answers tests = answersService.remove(id);
        if (tests == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/answers/addanswer")
    public Answers create(@RequestBody Answers data) throws IOException {
        return answersService.save(data);
    }
}
