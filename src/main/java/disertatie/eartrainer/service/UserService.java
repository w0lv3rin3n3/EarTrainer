package disertatie.eartrainer.service;

import disertatie.eartrainer.model.Users;
import disertatie.eartrainer.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    public final UserRepository repo;

    public List<Users> get() {
        return repo.findAll();
    }

    public List<Users> getById(Long id) {
        return repo.findFirstById(id);
    }

    public Users save(Users data) {
            if(repo.findByUserEmail(data.getUserEmail()) != null) {
                return data;
            }
            Users entity = new Users();
            entity.setUserName(data.getUserName());
            entity.setUserEmail(data.getUserEmail());
            entity.setPassword(data.getPassword());
            entity.setStatus(data.getStatus());
            entity.setCreationDate(LocalDateTime.now());
            return repo.save(entity);
    }

    public Users check(Users data) {
        if(repo.findByUserEmail(data.getUserEmail()) != null
        && repo.findByPassword(data.getPassword()) != null) {
            Users entity = repo.findByUserEmail(data.getUserEmail());
            entity.setStatus(data.getStatus());
            return repo.save(entity);
        }
        return data;
    }

    public Users logout(Users data) {
            Users entity = repo.findByUserEmail(data.getUserEmail());
            entity.setStatus(data.getStatus());
            return repo.save(entity);
    }

    public Users getByStatus(String status) {
        return repo.findFirstByStatusIs(status);
    }
    public Users getByEmail(String email) {
        return repo.findByUserEmail(email);
    }

    public Users remove(Long id) {
        return repo.deleteUserById(id);
    }
}
