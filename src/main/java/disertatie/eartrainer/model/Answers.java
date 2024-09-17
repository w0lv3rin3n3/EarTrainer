package disertatie.eartrainer.model;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Answers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private TestType exercise;

    private String type;

    private Integer level;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private TestType userInput;

    private Integer score;

    private LocalDateTime date_time;
}
