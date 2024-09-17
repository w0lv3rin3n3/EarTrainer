import {loggedInId} from "../shared/userProfile.js";

window.webkitAudioContext = undefined;
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
const oscillator = audioCtx.createOscillator();
const gainNode = new GainNode(audioCtx, {
    gain: 0.05
});

let randomFrequency;
let isChecked = false;

let level = document.getElementById('level').value;
let labels =    ['', 'C<sub>3</sub>♯', 'D<sub>3</sub>♯', 'F<sub>3</sub>♯', 'G<sub>3</sub>♯', 'A<sub>3</sub>♯',
                            'C<sub>4</sub>♯', 'D<sub>4</sub>♯', 'F<sub>4</sub>♯', 'G<sub>4</sub>♯', 'A<sub>4</sub>♯',
                            'C<sub>5</sub>♯', 'D<sub>5</sub>♯', 'F<sub>5</sub>♯', 'G<sub>5</sub>♯', 'A<sub>5</sub>♯',
                            'C<sub>3</sub>', 'D<sub>3</sub>', 'E<sub>3</sub>', 'F<sub>3</sub>', 'G<sub>3</sub>', 'A<sub>3</sub>', 'B<sub>3</sub>',
                            'C<sub>4</sub>', 'D<sub>4</sub>', 'E<sub>4</sub>', 'F<sub>4</sub>', 'G<sub>4</sub>', 'A<sub>4</sub>', 'B<sub>4</sub>',
                            'C<sub>5</sub>', 'D<sub>5</sub>', 'E<sub>5</sub>', 'F<sub>5</sub>', 'G<sub>5</sub>', 'A<sub>5</sub>', 'B<sub>5</sub>'];
let labels2 = ['', 'D<sub>3</sub>♭', 'E<sub>3</sub>♭', 'G<sub>3</sub>♭', 'A<sub>3</sub>♭', 'B<sub>3</sub>♭',
                            'D<sub>4</sub>♭', 'E<sub>4</sub>♭', 'G<sub>4</sub>♭', 'A<sub>4</sub>♭', 'B<sub>4</sub>♭',
                            'D<sub>5</sub>♭', 'E<sub>5</sub>♭', 'G<sub>5</sub>♭', 'A<sub>5</sub>♭', 'B<sub>5</sub>♭'];
const noteFrequencies = {
    "1": 138.59,
    '2': 155.56,
    '3': 185,
    '4': 207.65,
    '5': 233.08,
    '6': 277.18,
    '7': 311.13,
    '8': 369.99,
    '9': 415.30,
    '10': 466.16,
    '11': 554.37,
    '12': 622.25,
    '13': 739.99,
    '14': 830.61,
    '15': 932.33,
    '16': 130.81,
    '17': 146.83,
    '18': 164.81,
    '19': 174.61,
    '20': 196,
    '21': 220,
    '22': 246.94,
    '23': 261.63,
    '24': 293.66,
    '25': 329.63,
    '26': 349.23,
    '27': 392,
    '28': 440,
    '29': 493.88,
    '30': 523.25,
    '31': 587.33,
    '32': 659.25,
    '33': 698.46,
    '34': 783.99,
    '35': 880,
    '36': 987.77
};
const notes = {
    138.59: 'C<sub>3</sub>♯',
    155.56: 'D<sub>3</sub>♯',
    185: 'F<sub>3</sub>♯',
    207.65: 'G<sub>3</sub>♯',
    233.08: 'A<sub>3</sub>♯',
    277.18: 'C<sub>4</sub>♯',
    311.13: 'D<sub>4</sub>♯',
    369.99: 'F<sub>4</sub>♯',
    415.30: 'G<sub>4</sub>♯',
    466.16: 'A<sub>4</sub>♯',
    554.37: 'C<sub>5</sub>♯',
    622.25: 'D<sub>5</sub>♯',
    739.99: 'F<sub>5</sub>♯',
    830.61: 'G<sub>5</sub>♯',
    932.33: 'A<sub>5</sub>♯',
    130.81: 'C<sub>3</sub>',
    146.83: 'D<sub>3</sub>',
    164.81: 'E<sub>3</sub>',
    174.61: 'F<sub>3</sub>',
    196: 'G<sub>3</sub>',
    220: 'A<sub>3</sub>',
    246.94: 'B<sub>3</sub>',
    261.63: 'C<sub>4</sub>',
    293.66: 'D<sub>4</sub>',
    329.63: 'E<sub>4</sub>',
    349.23: 'F<sub>4</sub>',
    392: 'G<sub>4</sub>',
    440: 'A<sub>4</sub>',
    493.88: 'B<sub>4</sub>',
    523.25:  'C<sub>5</sub>',
    587.33: 'D<sub>5</sub>',
    659.25: 'E<sub>5</sub>',
    698.46: 'F<sub>5</sub>',
    783.99: 'G<sub>5</sub>',
    880: 'A<sub>5</sub>',
    987.77: 'B<sub>5</sub>'
};
let userInput;
let selectedIndex;

let questionCounter;

const questionNumber = document.querySelector('.questionNumber');
const answer = document.querySelector('.answer');
const type = document.getElementById('oscillatorType');

// Function to get a random value from the array
function getRandomValue(array) {
    // Generate a random index within the bounds of the array's length
    let randomIndex = Math.floor(Math.random() * array.length);
    // Return the value at the random index
    return array[randomIndex];
}

async function getRandomParams() {
    await fetch(`http://localhost:8080/tests/Note/${level}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            randomFrequency = getRandomValue(data.exercise.note.noteFrequencies);
            oscillator.frequency.value = randomFrequency;
            oscillator.connect(gainNode).connect(audioCtx.destination);
            console.log(`Random is generated: ${randomFrequency}`);
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await getRandomParams();

async function createOptions() {
    try {
        const pianoContainer = document.querySelector('.piano-container');
        const functionality = document.getElementById('functionality');
        functionality.removeChild(pianoContainer);
    } catch (e) {}

    let pianoContainer = document.createElement("div");
    pianoContainer.classList.add('piano-container');
        for (let index = 1; index <= 36; index++) {
            let div = document.createElement("div");
            div.classList.add("key", index <= 15 ? "black-key" : "white-key");
            let label = document.createElement(index <= 15 ? 'h4' : 'h2');
            div.classList.add(`option-${index}`);
            label.innerHTML = index <= 15 ? labels[index] + '<br>' + labels2[index] : labels[index];
            // let label2 = document.createElement(index <= 15 ? 'h4' : 'h2');
            // label2.innerHTML = labels2[index];
            div.appendChild(label);
            // if(index <= 15)
            //     div.appendChild(label2);
            //For playing audio on click
            // const number = index <= 9 ? "0" + index : index;
            // div.addEventListener("click", () => {
            //     new Audio(`${base}key${number}.mp3`).play();
            // });
            pianoContainer.appendChild(div);
            // console.log(String(label));
            document.getElementById('functionality').appendChild(pianoContainer);
        }
}

await createOptions();

function createPianoEventListeners() {
    for (let index = 1; index <= 36; index++) {
        document.querySelector(`.option-${index}`).addEventListener('click', function () {
            try {
                document.querySelector(`.option-${selectedIndex}`).classList.remove('active');
            } catch (e) {}
            console.log("ceva");
            userInput = noteFrequencies[String(index)];
            console.log(userInput);
            selectedIndex = index;
            document.querySelector(`.option-${selectedIndex}`).classList.add('active');
            // const active = document.querySelector('.active');
            // active.style.backgroundColor = 'rgb(187, 182, 0)';
        });
    }
}

async function showQuestionsInfo() {
    let url = `http://localhost:8080/answers/${loggedInId}/Note/${level}`;
    await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            questionCounter = data.length;
        })
        .catch(error => {
            console.log('You need to be logged in to see info');
        });

    questionNumber.innerHTML = `Question no: ${questionCounter}`;
}

await showQuestionsInfo();

async function checkAnswer() {
    const active = document.querySelector('.active');
    isChecked = true;
    let percent;
    if(userInput === randomFrequency)
        percent = 100;
    else
        percent = 0;
    answer.innerHTML = `Correct answer: ${notes[randomFrequency]}`;
    if(percent === 100) {
        active.style.backgroundColor = '#00a421' ;
        answer.style.color = "#00a4a0";
    }
    else if(percent === 0) {
        active.style.backgroundColor = '#a4000e';
        answer.style.color = "#ff7b7b";
    }

    const data = {
        "userId": loggedInId,
        "exercise": {
            "noteParams": {
                "note": randomFrequency,
            },
        },
        "type": 'Note',
        "level": level,
        "userInput": {
            "noteParams": {
                "note": userInput,
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

document.getElementById('checkButton').addEventListener('click', async function (){
    await audioCtx.suspend();
    await checkAnswer();
})
document.getElementById('playButton').addEventListener('click', function (){
    oscillator.start();
    createPianoEventListeners();
})
document.getElementById('nextQuestionButton').addEventListener('click', async function (){
    isChecked = false;
    await createOptions();
    createPianoEventListeners()
    await showQuestionsInfo();
    await getRandomParams();
    await audioCtx.resume();
    answer.innerHTML = '';
})
document.getElementById('level').addEventListener('change', async function (){
    level = document.getElementById('level').value;
    await showQuestionsInfo();
    await  getRandomParams();
    await createOptions();
});
document.getElementById('oscillatorType').addEventListener('change', function (){
    oscillator.type = type.value;
})