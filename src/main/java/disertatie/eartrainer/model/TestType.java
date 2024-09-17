package disertatie.eartrainer.model;

import lombok.Data;

@Data
public class TestType {
    EqualizerTest eq;
    EqualizerParams eqParams;
    GainTest gain;
    GainParams gainParams;
    InstrumentsTest instruments;
    InstrumentsParams instrumentsParams;
    NoteTest note;
    NoteParams noteParams;
    PanningTest panning;
    PanningParams panningParams;
}
