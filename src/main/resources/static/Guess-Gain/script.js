import {loggedInId} from "../shared/userProfile.js";


let level = document.getElementById('level').value;

window.webkitAudioContext = undefined;
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
const audio = document.querySelector('audio');


const track = audioCtx.createMediaElementSource(audio);
audio.loop = true;
const standardGainNode = audioCtx.createGain();
standardGainNode.gain.value = Math.pow(10, -10/20);
const randomizedGainNode = audioCtx.createGain();
let gains = [];
let inputGains = [];
let randomGain;
let isChecked = false;


// Function to get a random value from the array
function getRandomValue(array) {
    // Generate a random index within the bounds of the array's length
    let randomIndex = Math.floor(Math.random() * array.length);
    // Return the value at the random index
    return array[randomIndex];
}

async function getRandomParams() {
    gains = [-12, -10.5, -9, -7.5, -6, -4.5, -3, -1.5, 0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12];
    inputGains = [];
    await fetch(`http://localhost:8080/tests/Gain/${level}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            randomGain = getRandomValue(data.exercise.gain.gains);
            inputGains.push(randomGain);
            const index = gains.indexOf(randomGain);
            gains.splice(index, 1);
            inputGains.push(getRandomValue(gains));
            console.log(inputGains);
            try {
                randomizedGainNode.gain.value = Math.pow(12, (randomGain-10)/20);
                console.log(randomizedGainNode.gain.value);
            }
            catch {}
            console.log(`Random is generated: ${randomGain}`);
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await getRandomParams();

const samples = document.querySelector('.samples');
audio.src = samples.value;
audio.play();

function playOriginalSample() {
    try {
        track.disconnect(randomizedGainNode);
    }
    catch(e)
    {
        console.log('nu e conectat inca gainNode');
    }
    track.connect(standardGainNode).connect(audioCtx.destination);
}

function playGainApplied() {
    try {
        track.disconnect(standardGainNode);
    }
    catch(e)
    {
        console.log('nu e conectat inca gainNode');
    }
    track.connect(randomizedGainNode).connect(audioCtx.destination);
}

document.getElementById('playButton').addEventListener('click', function () {
    stop();
    playOriginalSample();
});

document.getElementById('originalSample').addEventListener('click', function() {
    stop();
    playOriginalSample();
});
document.getElementById('gainedSample').addEventListener('click', function() {
    stop();
    playGainApplied();
});
document.getElementById('checkButton').addEventListener('click', async function (){
    await checkAnswer();
})
document.getElementById('nextQuestionButton').addEventListener('click', async function (){
    isChecked = false;
    await showQuestionsInfo();
    await getRandomParams();
    answer.innerHTML = '';
    createOptions();
})
document.getElementById('level').addEventListener('change', async function (){
    level = document.getElementById('level').value;
    await showQuestionsInfo();
    await  getRandomParams();
    createOptions();
});
document.querySelector('.samples').addEventListener('change', async function () {
    audio.src = samples.value;
    audio.play();
});

function createOptions() {
    try {
        const div = document.querySelector('.options');
        document.body.removeChild(div);
    } catch (e) {}
    const div = document.createElement('div');
    div.classList.add('options');
    // if(level === '1' || level === '2') {
        console.log('hello');
        for(let i = 1; i <= 2; i++) {
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'select';
            input.id = `option-${i}`;
            if(i === 1)
                input.checked = true;
            const label = document.createElement('label');
            label.htmlFor = `option-${i}`;
            label.classList.add(`option`);
            label.classList.add(`option-${i}`);
            const labelDiv = document.createElement('div');
            labelDiv.classList.add('dot');
            const span = document.createElement('span');
            const valueToBeRemoved = getRandomValue(inputGains);
            input.value = valueToBeRemoved;
            span.innerText = `${valueToBeRemoved} dB`;
            const index = inputGains.indexOf(valueToBeRemoved);
            inputGains.splice(index, 1);
            label.appendChild(labelDiv);
            label.appendChild(span);
            div.appendChild(input);
            div.appendChild(label);
        } 
    // }
    document.body.appendChild(div);
}

createOptions();

let questionCounter;

const questionNumber = document.querySelector('.questionNumber');
const answer = document.querySelector('.answer');

async function showQuestionsInfo() {
    let url = `http://localhost:8080/answers/${loggedInId}/Gain/${level}`;
    await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            questionCounter = data.length;
            console.log(questionCounter);
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
    if(document.getElementById('option-1').checked)
        userInput = Number(document.getElementById('option-1').value);
    else if(document.getElementById('option-2').checked)
        userInput = Number(document.getElementById('option-2').value);
    if(userInput === randomGain) {
        percent = 100;
        answer.innerHTML = `Correct answer: ${randomGain} dB`;
        answer.style.color = "#00a4a0";
    } else {
        percent = 0;
        answer.innerHTML = `Correct answer: ${randomGain} dB`;
        answer.style.color = "#a40030";
    }

    const data = {
        "userId": loggedInId,
        "exercise": {
            "gainParams": {
                "gain": randomGain,
            },
        },
        "type": 'Gain',
        "level": level,
        "userInput": {
            "gainParams": {
                "gain": userInput,
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
