package disertatie.eartrainer.repo;


import disertatie.eartrainer.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    List<Users> findFirstById(Long id);
    Users deleteUserById(Long id);
    Users findByUserEmail(String email);
    Users findByPassword(String password);
    Users findFirstByStatusIs(String status);
}
