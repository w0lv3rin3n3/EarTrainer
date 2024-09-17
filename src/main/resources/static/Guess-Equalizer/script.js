//####################################################################################################################//
//###########################################    AUDIO.JS    #########################################################//
//####################################################################################################################//
import {loggedInId} from '../shared/userProfile.js'

let randomFreq;
let randomGain;
let randomQ;
let filter;
let level = document.getElementById('level').value;

let dragGaussian = false; // Flag to indicate drag status
let offsetX, offsetY; // Variables to store offset between mouse and bullet positions
let frequency = 400; // Initial frequency position on x-axis
let amplitude = 0; // Initial amplitude of the curve
let dev = 66;
let mappedMean = 1000;
let mappedAmplitude = 0;
let mappedDev = 2;

let freqPercent;
let gainPercent;
let qPercent;
let isChecked = false;

async function getRandomParams() {
    await fetch(`http://localhost:8080/tests/Equalizer/${level}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            randomFreq = getRandomValue(data.exercise.eq.frequencies);
            randomGain = getRandomValue(data.exercise.eq.gains);
            randomQ = getRandomValue(data.exercise.eq.bandwidths);
            try {
                questionFilter.frequency.value = randomFreq;
                questionFilter.gain.value = randomGain;
                questionFilter.Q.value = randomQ;
            }
            catch {}
            console.log(`Randoms are generated: ${randomFreq} , ${randomGain} , ${randomQ} for questionFilter`);
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await getRandomParams();

window.webkitAudioContext = undefined;
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
const audio = document.querySelector('audio');
const samples = document.querySelector('.samples');
audio.src = samples.value;
const track = audioCtx.createMediaElementSource(audio);
audio.loop = true;
audio.play();

let questionFilter = createBandpassFilter(audioCtx, 'question');
let responseFilter = createBandpassFilter(audioCtx, 'response');

let questionCounter;

const questionNumber = document.querySelector('.questionNumber');
const answer = document.querySelector('.answer');

const freqGuideLines = {
    "75": "20",
    "145": "65",
    "200": "100",
    "267": "400",
    "400": "1k",
    "450": "2k",
    "493": "4k",
    "578": "8k",
    "620": "10k",
    "683": "16k",
    "725": "20k"
};
const gainGuideLines = {
    "59": "12 dB",
    "92": "9 dB",
    "133": "6 dB",
    "167": "3 dB",
    "199": "0 dB",
    "233": "-3 dB",
    "267": "-6 dB",
    "308": "-9 dB",
    "340": "-12 dB"
};


// Function to get a random value from the array
function getRandomValue(array) {
    // Generate a random index within the bounds of the array's length
    let randomIndex = Math.floor(Math.random() * array.length);
    // Return the value at the random index
    return array[randomIndex];
}

// Function to create a bandpass filter
function createBandpassFilter(audioContext, questionOrResponse) {
    filter = audioContext.createBiquadFilter();
    filter.type = 'peaking';
    if(questionOrResponse === 'question') {
        filter.frequency.value = randomFreq;
        filter.gain.value = randomGain;
        filter.Q.value = randomQ;
    }
    if(questionOrResponse === 'response') {
        filter.frequency.value = mappedMean;
        filter.gain.value = mappedAmplitude;
        filter.Q.value = mappedDev;
    }
    return filter;
}

//####################################################################################################################//
//############################################    CONTROLS.JS    #####################################################//
//####################################################################################################################//

// Function to start playback
function playQuestion() {
    try {
        track.disconnect(responseFilter);
    }
    catch(e)
    {
        console.log('nu e conectat inca responseFIlter');
    }try {
        track.disconnect(audioCtx.destination);
    }
    catch(e)
    {
        console.log('nu e conectat inca destination');
    }
    track.connect(questionFilter).connect(audioCtx.destination);
}

function playResponse() {
    try {
        track.disconnect(questionFilter);
    }
    catch(e)
    {
        console.log('nu e conectat inca questionFilter');
    }    try {
        track.disconnect(audioCtx.destination);
    }
    catch(e)
    {
        console.log('nu e conectat inca destination');
    }
    
    track.connect(responseFilter).connect(audioCtx.destination);
}

function mapPercentRange(value, inMin, inMax, outMin, outMax) {
    if(value > inMax) {
        return 0;
    }
    return Math.round((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}

//Function to check answer
async function checkAnswer() {
    isChecked = true;

    try {
        const questionFreq = questionFilter.frequency.value;
        const questionGain = questionFilter.gain.value;
        const questionQ = questionFilter.Q.value;
        // console.log(questionFreq, questionGain, questionQ);
        const dFreq = Math.abs(questionFreq - responseFilter.frequency.value);
        const dGain = Math.abs(questionGain - responseFilter.gain.value);
        const dQ = Math.abs(questionQ - responseFilter.Q.value);
        // console.log(responseFilter.Q.value);
        switch(true) {
            case questionFreq <= 100:
                freqPercent = mapPercentRange(dFreq, 0, 80, 100, 0);
                break;
            case questionFreq <= 1000:
                freqPercent = mapPercentRange(dFreq, 0, 300, 100, 0);
                break;
            case questionFreq <= 4000:
                freqPercent = mapPercentRange(dFreq, 0, 800, 100, 0);
                break;
            case questionFreq <= 8000:
                freqPercent = mapPercentRange(dFreq, 0, 2000, 100, 0);
                break;
            case questionFreq <= 16000:
                freqPercent = mapPercentRange(dFreq, 0, 2000, 100, 0);
                break;
            case questionFreq <= 20000:
                freqPercent = mapPercentRange(dFreq, 0, 1000, 100, 0);
                break;
        }
        switch(true) {
            case questionGain <= -9:
                gainPercent = mapPercentRange(dGain, 0, 21, 100, 0);
                break;
            case questionGain <= -6:
                gainPercent = mapPercentRange(dGain, 0, 18, 100, 0);
                break;
            case questionGain <= -3:
                gainPercent = mapPercentRange(dGain, 0, 15, 100, 0);
                break;
            case questionGain <= 0:
                gainPercent = mapPercentRange(dGain, 0, 12, 100, 0);
                break;
            case questionGain >= 9:
                gainPercent = mapPercentRange(dGain, 0, 21, 100, 0);
                break;
            case questionGain >= 6:
                gainPercent = mapPercentRange(dGain, 0, 18, 100, 0);
                break;
            case questionGain >= 3:
                gainPercent = mapPercentRange(dGain, 0, 15, 100, 0);
                break;
            case questionGain >= 0:
                gainPercent = mapPercentRange(dGain, 0, 12, 100, 0);
                break;
        }
        switch(true) {
            case questionQ <= 2:
                qPercent = mapPercentRange(dQ, 0, 1.5, 100, 0);
                break;
            case questionQ <= 4:
                qPercent = mapPercentRange(dQ, 0, 2, 100, 0);
                break;
            case questionQ <= 8:
                qPercent = mapPercentRange(dQ, 0, 4, 100, 0);
                break;
        }
        // alert("Frequency percent: " + freqPercent   + "%" + "\n" +
        //     "Gain percent: "      + gainPercent   + "%" + "\n" +
        //     "Q percent: "         + qPercent      + "%");
        
    } catch(e){alert("An error occurred: you need to hit question and response before checking answer");}
    const data = {
        "userId": loggedInId,
        "exercise": {
            "eqParams": {
                "frequency": randomFreq,
                "gain": randomGain,
                "bandwidth": randomQ
            },
        },
        "type": 'Equalizer',
        "level": level,
        "userInput": {
            "eqParams": {
                "frequency": responseFilter.frequency.value,
                "gain": responseFilter.gain.value,
                "bandwidth": responseFilter.Q.value
            },
        },
        "score": (freqPercent+gainPercent+qPercent)/3,
    }
    showAnswers();
    audio.pause();
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

async function nextQuestion() {
    await getRandomParams();
    isChecked = false;
    audio.play();
    await resetCanvas();
    // await drawAllCanvas();
}

//####################################################################################################################//
//###########################################     CANVAS.JS     ######################################################//
//####################################################################################################################//

const equalizerCanvas = document.getElementById('equalizerCanvas');
const equalizerCtx = equalizerCanvas.getContext('2d');

//--------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------//

function mapRange(value, inMin, inMax, outMin, outMax) {
    return Math.round((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}

function mapRangeDecimal(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

async function resetCanvas() {
    frequency = 400;
    dev = 66;
    amplitude = 0;
    angle = [-1.49, 0, 1.86];
    await drawAllCanvas();
}

function mapFilterParameters() {
    findFreqOnAxis(frequency);
    mappedAmplitude = Math.round(-mapRangeDecimal(equalizerCanvas.height/2 - amplitude, 60, 340, -12, 12) * 2) / 2 ;
    mappedDev = mapRangeDecimal(dev, 10, 80, 8, 0.5).toFixed(2);
}

function setFilterParameters() {
    try {
        responseFilter.frequency.value = mappedMean;
        responseFilter.gain.value = mappedAmplitude;
        responseFilter.Q.value = mappedDev;
    } catch (e) {}
}

function findFreqOnAxis(axisPoint) {
    switch(true) {
        case axisPoint <= 200:
            mappedMean = Math.round(mapRange(axisPoint, 75, 200, 20, 100));
            break;
        case axisPoint <= 400:
            mappedMean = Math.round(mapRange(axisPoint, 200, 400, 101, 1000));
            break;
        case axisPoint <= 450:
            mappedMean = Math.round(mapRange(axisPoint, 400, 450, 1001, 2000));
            break;
        case axisPoint <= 620:
            mappedMean = Math.round(mapRange(axisPoint, 450, 620, 2001, 10000));
            break;
        case axisPoint <= 725:
            mappedMean = Math.round(mapRange(axisPoint, 620, 725, 10001, 20000));
            break;
    }
    return mappedMean;
}

function findAxisFromFreq(freq) {
    let output;
    switch(true) {
        case freq <= 100:
            output = Math.round(mapRange(freq, 20, 100, 75, 200));
            break;
        case freq <= 1000:
            output = Math.round(mapRange(freq, 101, 1000, 200, 400));
            break;
        case freq <= 2000:
            output = Math.round(mapRange(freq, 1001, 2000, 400, 450));
            break;
        case freq <= 10000:
            output = Math.round(mapRange(freq, 2001, 10000, 450, 620));
            break;
        case freq <= 20000:
            output = Math.round(mapRange(freq, 10001, 20000, 620, 725));
            break;
    }
    return output;
}

function findAxisFromGain(gain) {
    let output = Math.floor(-mapRange(equalizerCanvas.height/2 - amplitude, 60, 340, -12, 12) * 2) / 2 ;
    output = mapRange((gain), -12, 12, -140, 140);
    return output;
}

function findDevFromQ(q) {
    return mapRange(q, 0.5, 8, 80, 10);
}

function drawGuidelines() {
    equalizerCtx.beginPath();
    for(let key in gainGuideLines) {
        equalizerCtx.moveTo(0, key);
        equalizerCtx.lineTo(equalizerCanvas.width-50, Number(key));
        equalizerCtx.fillStyle = 'white';
        equalizerCtx.font = '12px Arial Bold';
    }
    for(let key in freqGuideLines) {
        equalizerCtx.moveTo(key, 0);
        equalizerCtx.lineTo(Number(key), equalizerCanvas.height);
        equalizerCtx.fillStyle = 'white';
        equalizerCtx.font = '12px Arial Bold';
    }
    equalizerCtx.strokeStyle = 'rgba(255, 255, 255, 1)'; // Set the curve color
    equalizerCtx.lineWidth = 0.2;
    equalizerCtx.stroke();
}

function labelGuidelines() {
    equalizerCtx.fillStyle = 'white';
    equalizerCtx.beginPath();
    for(let key in gainGuideLines) {
        equalizerCtx.fillText(gainGuideLines[key],equalizerCanvas.width-40 , Number(key)+5);
    }
    for(let key in freqGuideLines) {
        equalizerCtx.fillText(freqGuideLines[key],Number(key)+2 , equalizerCanvas.height-2);
    }
}

function drawGaussian(freq, gain, q, palette) {
    equalizerCtx.beginPath();
    let darkColor = 'rgba(0,84,81,0.7)';
    let lightColor = 'rgba(0,121,117,0.7)';
    for (let x = -200; x < equalizerCanvas.width+200; x++) {
        const y = gain * Math.exp(-Math.pow(x - freq, 2) / (2 * Math.pow(q, 2)));
        equalizerCtx.lineTo(x, equalizerCanvas.height/2 - y); // Invert the y-coordinate for correct orientation
    }

    if(palette === 'yellow') {
        darkColor = 'rgba(84,81,0,0.5)';
        lightColor = 'rgba(121,117,0,0.5)';
    }
    if(palette === 'red') {
        darkColor = 'rgb(255,255,255, 0)';
        lightColor = 'rgb(255,255,255)';
    }
    equalizerCtx.fillStyle = darkColor; // Set the curve color
    equalizerCtx.lineWidth = 3;
    equalizerCtx.strokeStyle = lightColor; // Set the curve color
    equalizerCtx.stroke();
    equalizerCtx.fill();

    if(palette !== 'yellow') {
        // Add a bullet at the peak of the Gaussian curve
        equalizerCtx.beginPath();
        equalizerCtx.arc(freq, equalizerCanvas.height/2 - gain, 10, 0, 2 * Math.PI); // Circle at the peak
        equalizerCtx.fillStyle = lightColor; // Set the bullet color
        equalizerCtx.fill();    
    }
}

function drawEqualizerCanvas() {
    equalizerCtx.clearRect(0, 0, equalizerCanvas.width, equalizerCanvas.height); // Clear the canvas
    const gradient = equalizerCtx.createLinearGradient(0, 0, 0, equalizerCanvas.height);
    gradient.addColorStop(1, 'black');
    gradient.addColorStop(0, '#333333');
    equalizerCtx.fillStyle = gradient;
    equalizerCtx.fillRect(0,0,equalizerCanvas.width,equalizerCanvas.height);
    drawGuidelines();
    if(isChecked)
        drawGaussian(findAxisFromFreq(randomFreq), findAxisFromGain(randomGain), findDevFromQ(randomQ), 'yellow');
    drawGaussian(frequency, amplitude, dev);
    labelGuidelines();
}

//--------------------------------------------------------------------------------------------------------------------//

equalizerCanvas.addEventListener('mousedown', function (e) {
    const rect = equalizerCanvas.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    if(offsetX < 75) offsetX = 75;
    if(offsetX > 725) offsetX = 725;
    if(offsetY < 50) offsetY = 50;
    if(offsetY > 350) offsetY = 350;

    // Check if the mouse is over the bullet
    const dx = offsetX - frequency;
    const dy = offsetY - (equalizerCanvas.height / 2 - amplitude);
    // console.log("OffsetX: ", offsetX, "OffsetY: ", offsetY, "dx: ", dx, "dy: ", dy);
    if (dx * dx + dy * dy < 100) { // 25 is the squared radius of the bullet
        dragGaussian = true;
    }
});

equalizerCanvas.addEventListener('mousemove', async function (e) {
    const rect = equalizerCanvas.getBoundingClientRect();
    if (dragGaussian) {
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        frequency = Math.round(e.clientX - rect.left);
        amplitude = equalizerCanvas.height / 2 - (e.clientY - rect.top);
        if(frequency < 75) frequency = 75;
        if(frequency > 725) frequency = 725;
        if(amplitude < -140) amplitude = -140;
        if(amplitude > 140) amplitude = 140;
        
        angle[0] = mapRangeDecimal(frequency, 75, 725, -Math.PI, Math.PI);
        angle[1] = mapRangeDecimal(amplitude, -140, 140, -Math.PI, Math.PI);
        await drawAllCanvas();
    }
});

equalizerCanvas.addEventListener('mouseup', function () {
    dragGaussian = false;
    dragKnob = false;
});

equalizerCanvas.addEventListener('dblclick', async function () {
    await resetCanvas();
});

//--------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------//
//--------------------------------------------------------------------------------------------------------------------//

const controlCanvas = document.getElementById('controlCanvas');
const controlCtx = controlCanvas.getContext('2d');

//--------------------------------------------------------------------------------------------------------------------//

let dragKnob = [false, false, false];
let mouseX, mouseY, deltaX, deltaY;
let knobParameters = [['Freq', 60, 60, 30, 0], ['Gain', 60, 180, 30, 0], ['  Q', 60, 300, 30, 0]];
let angle = [-1.49, 0, 1.87];

//--------------------------------------------------------------------------------------------------------------------//

function findFreqOnKnob(knobNumber, angle) {
    switch(true) {
        case angle <= -2.5:
            knobParameters[knobNumber][4] = Math.round(mapRange(angle, -Math.PI, -2.5, 75, 200));
            break;
        case angle <= -1.5:
            knobParameters[knobNumber][4] = Math.round(mapRange(angle, -2.5, -1.5, 200, 400));
            break;
        case angle <= 0:
            knobParameters[knobNumber][4] = Math.round(mapRange(angle, -1.5, 0, 400, 450));
            break;
        case angle <= 1.5:
            knobParameters[knobNumber][4] = Math.round(mapRange(angle, 0, 1.5, 450, 620));
            break;
        case angle <= Math.PI:
            knobParameters[knobNumber][4] = Math.round(mapRange(angle, 1.5, Math.PI, 620, 725));
            break;
    }
    return knobParameters[knobNumber][4];
}

function drawKnob(knobName, knobNumber, xAxisCenter, yAxisCenter, dimension) {
    // Draw outer circle
    controlCtx.beginPath();
    controlCtx.arc(xAxisCenter, yAxisCenter, dimension, 0, Math.PI * 2);
    controlCtx.strokeStyle = '#007975';
    controlCtx.lineWidth = 5;
    controlCtx.stroke();

    // Draw indicator line
    controlCtx.beginPath();
    controlCtx.moveTo(xAxisCenter, yAxisCenter);
    let indicatorX = xAxisCenter + Math.cos(angle[knobNumber]) * dimension;
    let indicatorY = yAxisCenter + Math.sin(angle[knobNumber]) * dimension;
    controlCtx.lineTo(indicatorX, indicatorY);
    controlCtx.strokeStyle = '#007975';
    controlCtx.lineWidth = 5;
    controlCtx.stroke();

    controlCtx.fillStyle = 'white';
    controlCtx.font = '14px Arial Bold';
    controlCtx.fillText(knobName, xAxisCenter-11, yAxisCenter+dimension+20);
}

function showEqParameters() {
    controlCtx.fillStyle = 'white';
    controlCtx.font = '16px Arial Bold';
    mapFilterParameters();
    setFilterParameters();

    const mappedFreqChars = mappedMean.toString().length;

    if(mappedFreqChars === 2)
        controlCtx.fillText(mappedMean + ' Hz', 45, 135);
    else if(mappedFreqChars === 3)
        controlCtx.fillText(mappedMean + ' Hz', 40, 135);
    else if(mappedFreqChars === 4)
        controlCtx.fillText(mappedMean + ' Hz', 35, 135);
    else if(mappedFreqChars === 5)
        controlCtx.fillText(mappedMean + ' Hz', 30, 135);

    const mappedAmplChars = mappedAmplitude.toString().length;
    
    if(mappedAmplChars === 1)
        controlCtx.fillText(mappedAmplitude + ' dB', 50, 250);
    else if(mappedAmplChars === 2)
        controlCtx.fillText(mappedAmplitude + ' dB', 45, 250);
    else if(mappedAmplChars === 3)
        controlCtx.fillText(mappedAmplitude + ' dB', 40, 250);
    else if(mappedAmplChars === 4)
        controlCtx.fillText(mappedAmplitude + ' dB', 35, 250);
    else if(mappedAmplChars === 5)
        controlCtx.fillText(mappedAmplitude + ' dB', 30, 250);

    controlCtx.fillText(mappedDev, 50, 370);
}

async function showQuestionsInfo() {
    let url = `http://localhost:8080/answers/${loggedInId}/Equalizer/${level}`;
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

function showAnswers() {
    answer.innerHTML = `Correct answer: Freq: <span class="freq"> ${randomFreq}</span> Hz, Gain: <span class="gain"> ${randomGain}</span> dB, Q: <span class="q"> ${randomQ}</span>`;
    answer.style.color = '#fff';
    const freq = document.querySelector('.freq');
    const gain = document.querySelector('.gain');
    const q = document.querySelector('.q');
    if(freqPercent > 80)
        freq.style.color = "#00a4a0";
    else
        freq.style.color = "#ff7b7b";
    if(gainPercent > 80)
        gain.style.color = "#00a4a0";
    else
        gain.style.color = "#ff7b7b";
    if(qPercent > 80)
        q.style.color = "#00a4a0";
    else
        q.style.color = "#ff7b7b";
}

await showQuestionsInfo();

async function drawControlCanvas() {
    controlCtx.clearRect(0, 0, controlCanvas.width, controlCanvas.height); // Clear the canvas
    const gradient = controlCtx.createLinearGradient(0, 0, 0, controlCanvas.height);
    gradient.addColorStop(1, 'black');
    gradient.addColorStop(0, '#333333');
    controlCtx.fillStyle = gradient;
    controlCtx.fillRect(0,0,controlCanvas.width,controlCanvas.height);
    for(let knobNumber = 0; knobNumber < knobParameters.length; knobNumber++) {
        drawKnob(knobParameters[knobNumber][0], knobNumber, knobParameters[knobNumber][1], knobParameters[knobNumber][2], knobParameters[knobNumber][3]);
    }
    showEqParameters();
}

async function drawAllCanvas() {
    drawEqualizerCanvas();
    await drawControlCanvas();
}

await drawAllCanvas(); // Initial draw

//--------------------------------------------------------------------------------------------------------------------//

controlCanvas.addEventListener('mousedown', function (e) {
    const rect = controlCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    // console.log(mouseX, mouseY);
    for(let knobNumber = 0; knobNumber < knobParameters.length; knobNumber++) {
        if ((mouseX > knobParameters[knobNumber][1]-knobParameters[knobNumber][3]) && mouseX < knobParameters[knobNumber][1] + knobParameters[knobNumber][3] &&
            mouseY > knobParameters[knobNumber][2]-knobParameters[knobNumber][3] && mouseY < knobParameters[knobNumber][2] + knobParameters[knobNumber][3])
                try{
                    dragKnob[knobNumber] = true;
                }
                catch {}

    }
});

controlCanvas.addEventListener('mousemove', async function (e) {
    const rect = controlCanvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    for(let knobNumber = 0; knobNumber < knobParameters.length; knobNumber++) {
        if (dragKnob[knobNumber]) {
            deltaX = mouseX - knobParameters[knobNumber][1];
            deltaY = mouseY - knobParameters[knobNumber][2];
            angle[knobNumber] = Math.atan2(deltaY, deltaX).toFixed(2);
            switch(knobParameters[knobNumber][0]) {
                case 'Freq':
                    frequency = findFreqOnKnob(knobNumber, angle[knobNumber]);
                    break;
                case 'Gain':
                    amplitude = mapRange(angle[knobNumber], -Math.PI, Math.PI, -140, 140);
                    break;
                case '  Q':
                    dev = mapRange(angle[knobNumber], -Math.PI, Math.PI, 10, 80);
                    // console.log(dev);
                    // console.log(angle[knobNumber]);
                    break;
            }
            // console.log(angle[knobNumber]);
            await drawAllCanvas();
        }
    }
});

controlCanvas.addEventListener('mouseup', function () {
    // dragGaussian = false;
    dragKnob = [false, false, false];
});

controlCanvas.addEventListener('dblclick', async function () {
    await resetCanvas();
});

//--------------------------------------------------------------------------------------------------------------------//

//####################################################################################################################//
//########################################    EVENTLISTENERS.JS    ###################################################//
//####################################################################################################################//

document.getElementById('playButton').addEventListener('click', function () {
    track.connect(audioCtx.destination);
});
document.getElementById('responseButton').addEventListener('click', function() {
    // stop();
    playResponse();
});
document.getElementById('questionButton').addEventListener('click', function() {
    // stop();
    playQuestion();
});
document.getElementById('checkButton').addEventListener('click', async function() {
    await checkAnswer();
    await drawAllCanvas();
});
document.getElementById('nextQuestionButton').addEventListener('click', async function() {
    answer.innerHTML = '';
    await nextQuestion();
    await showQuestionsInfo();
});
document.getElementById('level').addEventListener('change', async function (){
    level = document.getElementById('level').value;
    await  getRandomParams();
    await showQuestionsInfo();
    showEqParameters();
});
document.querySelector('.samples').addEventListener('change', async function () {
    audio.src = samples.value;
    audio.play();
});
