'use strict'

const AWS_BASE_URL = "https://cyt189a497.execute-api.us-east-1.amazonaws.com/prod";
const SESSION_USER = sessionStorage.getItem("session-user");

function validateLogin() {
    return new Promise(async (resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${AWS_BASE_URL}/auth/verify`);
        xhr.onload = () => {
            let response = JSON.parse(xhr.responseText);
            if (xhr.status != 200 || !response.valid) {
                sessionStorage.setItem("session-user", null);
                reject("Credenciales inválidas. Inicie sesión nuevamente.");
            } else {
                resolve(response.decoded);
            }
        };
        xhr.send(JSON.stringify({ token: SESSION_USER }));
    });
}