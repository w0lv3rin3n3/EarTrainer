import {loggedInId} from "../shared/userProfile.js";
// import {createMelodiesList} from "./multitracks";


let level = document.getElementById('level').value;

let level2 = Number(document.getElementById('level').value) + 1;

let globalSamplesElement;

async function createMelodiesList() {
    const dropdownList = document.querySelector('.dropdown-list');
    // for(let elem = 0; elem < samplesElement.length; elem++)
        // samplesElement.remove(elem);
    try {
        const samplesElement = document.getElementById('samples');
        dropdownList.removeChild(samplesElement);
    }
    catch {}

    await fetch(`http://localhost:8080/melodies/${level2}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const samples = document.createElement('select');
            samples.classList.add('samples');
            samples.id = 'samples';
            samples.style.width = '15rem';
            // const samples = document.querySelector('.samples');
            for(let index = 0; index < data.length; index++) {
                const option = document.createElement('option');
                option.value = `${data[index].id}`;
                option.innerHTML = data[index].fileName + ` (${data[index].level})`;
                samples.appendChild(option);
            }
            dropdownList.appendChild(samples);
            globalSamplesElement = document.querySelector('.samples');
            samples.addEventListener('change', async function () {
                resetInstrumentImages();
                await getRandomParams();
            });
            // console.log(`Randoms are generated: ${randomFreq} , ${randomGain} , ${randomQ} for questionFilter`);
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await createMelodiesList();

window.webkitAudioContext = undefined;
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
let randomInstruments = {"piano": false, "eg":false, "ag":false, "bass":false, "drums":false, "violin":false, "saxophone":false, "vox":false};
let questionInstruments = [];
let responseInstruments = [];
let randomIndex;

let tracks = [];
let isChecked = false;


// Function to get a random value from the array
function getRandomValue(array) {
    // Generate a random index within the bounds of the array's length
    randomIndex = Math.floor(Math.random() * array.length);
    // Return the value at the random index
    return array[randomIndex];
}

async function getRandomParams() {
    const samples = document.querySelector('.samples');
    let url;
    console.log(samples.value);
    if(samples.value)
        url = `http://localhost:8080/multitracks/${samples.value}`;
    else
        url = `http://localhost:8080/multitracks/3`;

    console.log(url);
    await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            try {
                try {
                    document.body.removeChild(document.querySelector(`.audioDiv`));
                } catch {}
                const audioDiv = document.createElement('div');
                audioDiv.classList.add(`audioDiv`);
                for(let i = 0; i < Math.floor(Number(level)+1); i++) {
                    // try {
                        // document.body.removeChild(document.getElementsByName(`audio`));
                        // document.body.removeChild(document.querySelector(`.audio${i}`));
                    // }
                    // catch {}
                    let sample = getRandomValue(data);
                    // do {
                    //     sample = getRandomValue(data);
                    // } while (randomInstruments[sample.instrumentType] === false)

                    data.splice(randomIndex, 1);
                    // const sample = getRandomValue(data);

                    const audioElement = document.createElement('audio');
                    audioElement.classList.add(`audio${i}`);
                    audioElement.src = `http://localhost:8080/multitracks/${sample.melodyId}/${sample.instrumentType}/data`;
                    randomInstruments[sample.instrumentType] = true;
                    tracks[i] = audioCtx.createMediaElementSource(audioElement);
                    audioElement.loop = true;
                    audioDiv.appendChild(audioElement);
                    audioElement.play();
                }
                document.body.appendChild(audioDiv);
                // console.log(randomInstruments);
            }
            catch {}
            // console.log(`Random is generated:`);
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await getRandomParams();

function play() {
    for(let i = 0; i < tracks.length; i++)
    {
        tracks[i].connect(audioCtx.destination);
    }
}

function stop() {
    for(let i = 0; i < tracks.length; i++)
    {
        tracks[i].connect(audioCtx.destination);
    }
}

document.getElementById('playButton').addEventListener('click', function() {
    stop();
    play();
});
document.getElementById('checkButton').addEventListener('click', async function (){
    await checkAnswer();
})
document.getElementById('nextQuestionButton').addEventListener('click', async function (){
    isChecked = false;
    stop();
    resetInstrumentImages();
    await showQuestionsInfo();
    await getRandomParams();
    answer.innerHTML = '';
    play();
})
document.getElementById('level').addEventListener('change', async function (){
    level = document.getElementById('level').value;
    level2 = Number(document.getElementById('level').value) + 1;
    resetInstrumentImages();
    await createMelodiesList();
    await showQuestionsInfo();
    await getRandomParams();
});
// document.getElementById('samples').addEventListener('change', async function () {
//     resetInstrumentImages();
//     await getRandomParams();
// });

const pianoContainer = document.querySelector('#piano-input');
const egContainer = document.querySelector('#eg-input');
const agContainer = document.querySelector('#ag-input');
const bassContainer = document.querySelector('#bass-input');
const drumsContainer = document.querySelector('#drums-input');
const violinContainer = document.querySelector('#violin-input');
const saxophoneContainer = document.querySelector('#saxophone-input');
const voxContainer = document.querySelector('#vox-input');

function resetInstrumentImages() {
    randomInstruments = {"piano": false, "eg":false, "ag":false, "bass":false, "drums":false, "violin":false, "saxophone":false, "vox":false};
    for(const instr in randomInstruments) {
        const instrButton = document.getElementById(instr);
        const instrContainer = document.querySelector(`#${instr}-input`);
        const instrImage = document.getElementById(`${instr}-image`);
        instrButton.style.backgroundColor = "#ffffff";
        instrContainer.checked = false;
        instrImage.src = `../images/Instruments/${instr}.png`;
    }
}

pianoContainer.addEventListener('change', async function () {
    if(pianoContainer.checked) {
        document.getElementById("piano-image").src = "../images/Instruments/piano-color.png";
    }
    else {
        document.getElementById("piano-image").src = "../images/Instruments/piano.png";
    }
});
egContainer.addEventListener('change', async function () {
    if(egContainer.checked) {
        document.getElementById("eg-image").src = "../images/Instruments/eg-color.png";
    }
    else {
        document.getElementById("eg-image").src = "../images/Instruments/eg.png";
    }
});
agContainer.addEventListener('change', async function () {
    if(agContainer.checked) {
        document.getElementById("ag-image").src = "../images/Instruments/ag-color.png";
    }
    else {
        document.getElementById("ag-image").src = "../images/Instruments/ag.png";
    }
});
bassContainer.addEventListener('change', async function () {
    if(bassContainer.checked) {
        document.getElementById("bass-image").src = "../images/Instruments/bass-color.png";
    }
    else {
        document.getElementById("bass-image").src = "../images/Instruments/bass.png";
    }
});
drumsContainer.addEventListener('change', async function () {
    if(drumsContainer.checked) {
        document.getElementById("drums-image").src = "../images/Instruments/drums-color.png";
    }
    else {
        document.getElementById("drums-image").src = "../images/Instruments/drums.png";
    }
});
violinContainer.addEventListener('change', async function () {
    if(violinContainer.checked) {
        document.getElementById("violin-image").src = "../images/Instruments/violin-color.png";
    }
    else {
        document.getElementById("violin-image").src = "../images/Instruments/violin.png";
    }
});
saxophoneContainer.addEventListener('change', async function () {
    if(saxophoneContainer.checked) {
        document.getElementById("saxophone-image").src = "../images/Instruments/saxophone-color.png";
    }
    else {
        document.getElementById("saxophone-image").src = "../images/Instruments/saxophone.png";
    }
});
voxContainer.addEventListener('change', async function () {
    if(voxContainer.checked) {
        document.getElementById("vox-image").src = "../images/Instruments/vox-color.png";
    }
    else {
        document.getElementById("vox-image").src = "../images/Instruments/vox.png";
    }
});

let questionCounter;

const questionNumber = document.querySelector('.questionNumber');
const answer = document.querySelector('.answer');

async function showQuestionsInfo() {
    let url = `http://localhost:8080/answers/${loggedInId}/Instruments/${level}`;
    await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            questionCounter = data.length;
            // console.log(questionCounter);
        })
        .catch(error => {
            console.log('You need to be logged in to see info');
        });

    questionNumber.innerHTML = `Question no: ${questionCounter}`;
}

await showQuestionsInfo();

async function checkAnswer() {
    isChecked = true;

    let userInput;
    let percent;
    userInput = {   
        "piano":pianoContainer.checked, 
        "eg":egContainer.checked, 
        "ag":agContainer.checked, 
        "bass":bassContainer.checked,
        "drums":drumsContainer.checked,
        "violin":violinContainer.checked,
        "saxophone":saxophoneContainer.checked,
        "vox":voxContainer.checked
    }
    // console.log(userInput);
    // console.log("--------------------------");
    // console.log(randomInstruments);
    questionInstruments = [];
    responseInstruments = [];
    for(const instr in randomInstruments) {
        const instrButton = document.getElementById(instr);
        if(randomInstruments[instr])
            questionInstruments.push(instr);
        if(userInput[instr])
            responseInstruments.push(instr);
        if(randomInstruments[instr] && userInput[instr])
            instrButton.style.backgroundColor = "#00a4a0";
        else if(randomInstruments[instr] && !userInput[instr])
            instrButton.style.backgroundColor = "#a4a000";
        else if(!randomInstruments[instr] && userInput[instr])
            instrButton.style.backgroundColor = "#a40030";
    }
    if(JSON.stringify(userInput) === JSON.stringify(randomInstruments)) {
        percent = 100;
        answer.innerHTML = `Correct answer: ${questionInstruments}`;
        answer.style.color = "#00a4a0";
    } else {
        percent = 0;
        answer.innerHTML = `Incorrect answer: ${questionInstruments}`;
        answer.style.color = "#a40030";
    }

    const data = {
        "userId": loggedInId,
        "exercise": {
            "instrumentsParams": {
                "instruments": questionInstruments,
            },
        },
        "type": 'Instruments',
        "level": level,
        "userInput": {
            "instrumentsParams": {
                "instruments": responseInstruments,
            },
        },
        "score": percent,
    }
    console.log(data);
    await fetch(`http://localhost:8080/answers/addanswer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response data
            if (data.id === null)
                console.log('The response could not be added to db');
            else {
                console.log('you successfully added a response to db');
            }
            // You can perform any additional actions here after receiving the response
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
}
