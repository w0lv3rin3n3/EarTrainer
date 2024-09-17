import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import {loggedInId} from "../shared/userProfile.js";

async function createSamplesList() {
    await fetch(`http://localhost:8080/samples`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const samples = document.querySelector('.samples');
            for(let index = 0; index < data.length; index++) {
                const option = document.createElement('option');
                option.value = `http://localhost:8080/samples/${data[index].id}/data`;
                option.innerHTML = data[index].fileName;
                samples.appendChild(option);
            }
            // console.log(`Randoms are generated: ${randomFreq} , ${randomGain} , ${randomQ} for questionFilter`);
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await createSamplesList();

window.webkitAudioContext = undefined;
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();
const audio = document.querySelector('audio');
const samples = document.querySelector('.samples');
const pannerNode = audioCtx.createStereoPanner();
let randomPanning;
randomPanning = 70;
pannerNode.pan.value = 0.7;
audio.src = samples.value;
const track = audioCtx.createMediaElementSource(audio);
audio.loop = true;
audio.play();

let isChecked = false;

let level = document.getElementById('level').value;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#000000');
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(400, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(0, 0, 50);
const spotLight = new THREE.SpotLight(0xffffff, 10000, 500, 360, 1);
spotLight.position.set(0, 10, 60);
scene.add(spotLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 60;
controls.maxDistance = 60;
controls.minPolarAngle = 1.5;
controls.maxPolarAngle = 1.5;
controls.minAzimuthAngle = -1.5;
controls.maxAzimuthAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 0, 0);
controls.update();

const controls2 = new OrbitControls(spotLight, renderer.domElement);
controls2.enableDamping = true;
controls2.enablePan = true;
controls2.minDistance = 60;
controls2.maxDistance = 60;
controls2.minPolarAngle = 1.5;
controls2.maxPolarAngle = 1.5;
controls2.minAzimuthAngle = -1.5;
controls2.maxAzimuthAngle = 1.5;
controls2.autoRotate = false;
controls2.target = new THREE.Vector3(0, 0, 0);
controls2.update();

const loader = new GLTFLoader().setPath('../images/3dHeadModel2/');
loader.load('scene.gltf', (gltf) => {
    console.log('loading model');
    const mesh = gltf.scene;

    mesh.scale.set(0.45, 0.45, 0.45);
    mesh.position.set(0,0,0);
    
    scene.add(mesh);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to get a random value from the array
function getRandomValue(array) {
    // Generate a random index within the bounds of the array's length
    let randomIndex = Math.floor(Math.random() * array.length);
    // Return the value at the random index
    return array[randomIndex];
}

async function getRandomParams() {
    await fetch(`http://localhost:8080/tests/Panning/${level}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            randomPanning = getRandomValue(data.exercise.panning.pans);
            console.log(`Random is generated: ${randomPanning}`);
            pannerNode.pan.value = randomPanning/100;
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

await getRandomParams();


let questionCounter;

const questionNumber = document.querySelector('.questionNumber');
const userInputElement = document.querySelector('.userInput');
const answer = document.querySelector('.answer');

async function showQuestionsInfo() {
    let url = `http://localhost:8080/answers/${loggedInId}/Panning/${level}`;
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
    isChecked = true;
    let userInput;
    let percent;
    userInput = mapPercentRange(controls.getAzimuthalAngle().toFixed(2), -1.50, 1.50, 100, -100);
    if(userInput === randomPanning) {
        percent = 100;
        answer.innerHTML = `Correct answer: ${randomPanning} %`;
        answer.style.color = "#00a4a0";
        spotLight.color.set(0, 100, 0);
    }
    else {
        percent = 0;
        answer.innerHTML = `Correct answer: ${randomPanning} %`;
        answer.style.color = "#a40030";
        spotLight.color.set(100, 0, 0);
    }

    const data = {
        "userId": loggedInId,
        "exercise": {
            "panningParams": {
                "pan": randomPanning,
            },
        },
        "type": 'Panning',
        "level": level,
        "userInput": {
            "panningParams": {
                "pan": userInput,
            },
        },
        "score": percent,
    }
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

function mapPercentRange(value, inMin, inMax, outMin, outMax) {
    if(value > inMax) {
        return 0;
    }
    return Math.round((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin);
}

document.getElementById('playButton').addEventListener('click', function() {
    track.connect(pannerNode).connect(audioCtx.destination);
});
window.addEventListener('dblclick', function() {
    camera.position.set(0, 0, 50);
    spotLight.position.set(0, 10, 60);
});
document.getElementById('checkButton').addEventListener('click', async function (){
    await checkAnswer();
})
document.getElementById('nextQuestionButton').addEventListener('click', async function (){
    isChecked = false;
    camera.position.set(0, 0, 50);
    spotLight.position.set(0, 10, 60);
    await showQuestionsInfo();
    await getRandomParams();
    answer.innerHTML = '';
})
document.getElementById('level').addEventListener('change', async function (){
    level = document.getElementById('level').value;
    await showQuestionsInfo();
    await  getRandomParams();
});
document.querySelector('.samples').addEventListener('change', async function () {
    audio.src = samples.value;
    audio.play();
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    controls2.update();
    if(isChecked === false) {
        // console.log(controls.getAzimuthalAngle());
        if((controls.getAzimuthalAngle().toFixed(2)) != 0.00) {
            spotLight.color.set(100, 100, 0);
            spotLight.intensity = 100;
        }
        else {
            spotLight.color.set(255, 255, 255);
            spotLight.intensity = 80;
        }
    }

    userInputElement.innerHTML = `User Input: ${mapPercentRange(controls.getAzimuthalAngle().toFixed(2), -1.50, 1.50, 100, -100)} %`;
    renderer.render(scene, camera);
}

animate();