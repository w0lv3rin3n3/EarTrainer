package disertatie.eartrainer.model;

import lombok.Data;

import java.util.List;

@Data
public class EqualizerTest {
    List<Integer> frequencies;
    List<Integer> gains;
    List<Integer> bandwidths;
}
