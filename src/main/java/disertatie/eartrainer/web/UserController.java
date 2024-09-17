package disertatie.eartrainer.web;

import disertatie.eartrainer.model.Users;
import disertatie.eartrainer.service.SampleService;
import disertatie.eartrainer.service.UserService;
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
public class UserController {

    private final UserService userService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello World!";
    }

    @GetMapping("/users")
    public List<Users> get() {
        return userService.get();
    }

    @GetMapping("/users/{id}")
    public List<Users> getUser(@PathVariable Long id) {
        List<Users> users = userService.getById(id);
        if (users == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return users;
    }

    @GetMapping("/users/logged_in")
    public Users getUser() {
        Users users = userService.getByStatus("logged_in");
        if (users == null) throw new ResponseStatusException(HttpStatus.NO_CONTENT);
        return users;
    }

    @DeleteMapping("/users/delete/{id}")
    public void delete(@PathVariable Long id) {
        Users users = userService.remove(id);
        if (users == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/users/adduser")
    public Users create(@RequestBody Users data) throws IOException {
        return userService.save(data);
    }

    @PostMapping("/users/check")
    public Users check(@RequestBody Users data) throws IOException {
        return userService.check(data);
    }

    @PostMapping("/users/logout")
    public Users logout(@RequestBody Users data) throws IOException {
        return userService.logout(data);
    }
}
