import {wrapper} from "./registrationForm.js";
const login = document.querySelector("#login");
const signup = document.querySelector("#signup");
const btnLogin = document.querySelector('.btnLogin-popup');
const signUpUserName = document.getElementById("signUpUserName");
const signUpUserEmail = document.getElementById("signUpUserEmail");
const signUpUserPassword = document.getElementById("signUpPassword");
const logInUserEmail = document.getElementById("logInUserEmail");
const logInUserPassword = document.getElementById("logInPassword");
export let loggedInId;
export let loggedInEmail;
export let loggedInPassword;
const btnUser = document.querySelector('.btnUser');
const btnLogout = document.querySelector('.btnLogout');

function showLoginBtn() {
    btnLogin.classList.remove('hidden');
    btnUser.classList.add('hidden');
    btnLogout.classList.add('hidden');
}

function showProfileLogoutBtn() {
    btnLogin.classList.add('hidden');
    btnUser.classList.remove('hidden');
    btnLogout.classList.remove('hidden');
}


async function loadUserLoggingStatus() {
await fetch('http://localhost:8080/users/logged_in')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loggedInId = data.id;
            loggedInEmail = data.userEmail;
            loggedInPassword = data.password;
            console.log(`Person with email ${loggedInEmail} is logged in`);
            showProfileLogoutBtn();
        })
        .catch(error => {
            // console.error('There was a problem with your fetch operation:', error);
        });
}

export const result = await loadUserLoggingStatus();

signup.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {};
    data.userName = signUpUserName.value;
    data.userEmail = signUpUserEmail.value;
    data.password = signUpUserPassword.value;
    fetch("http://localhost:8080/users/adduser", {
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
                console.log('you already have an account');
            else {
                console.log('you successfully created an account');
                wrapper.classList.remove('active-popup');
            }
            // You can perform any additional actions here after receiving the response
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
});
login.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {};
    data.userEmail = logInUserEmail.value;
    data.password = logInUserPassword.value;
    data.status = 'logged_in';
    fetch("http://localhost:8080/users/check", {
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
            // console.log(data);
            if (data.id !== null) {
                console.log('you are logged in');
                showProfileLogoutBtn();
                wrapper.classList.remove('active-popup');
            } else {
                console.log('Did not find an account with these credentials. Please try signUp');
            }
            // You can perform any additional actions here after receiving the response
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
});
btnLogout.addEventListener("click", (event) => {
    event.preventDefault();
    const data = {};
    data.userEmail = loggedInEmail;
    data.password = loggedInPassword;
    data.status = 'logged_out';
    fetch("http://localhost:8080/users/logout", {
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
            console.log('you are logged out');
            showLoginBtn();
            window.location.href='../Home/index.html'
            // You can perform any additional actions here after receiving the response
        })
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });
});
