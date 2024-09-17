package disertatie.eartrainer.model;

import com.vladmihalcea.hibernate.type.json.JsonType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Type;

@Entity
@Getter
@Setter
public class Tests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

//    @NotEmpty
    private Integer level;

    private String type;

    @Type(JsonType.class)
    @Column(columnDefinition = "jsonb")
    private TestType exercise;
}
