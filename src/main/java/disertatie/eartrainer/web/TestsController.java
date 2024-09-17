package disertatie.eartrainer.web;

import disertatie.eartrainer.model.Tests;
import disertatie.eartrainer.service.TestsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestsController {

    private final TestsService testsService;

    @GetMapping("/tests")
    public List<Tests> getAll() {
        return testsService.getAll();
    }

    @GetMapping("/tests/{type}/{level}")
    public Tests getTests(@PathVariable String type, @PathVariable Integer level) {
        Tests tests = testsService.getTestsByLevel(type, level);
        if (tests == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return tests;
    }

    @DeleteMapping("/tests/delete/{id}")
    public void delete(@PathVariable Long id) {
        Tests tests = testsService.remove(id);
        if (tests == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/tests/addtest")
    public Tests create(@RequestBody Tests data) throws IOException {
        return testsService.save(data);
    }
}
