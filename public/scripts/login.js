'use strict'

const AWS_BASE_URL = "https://cyt189a497.execute-api.us-east-1.amazonaws.com/prod";

function logIn(evt) {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if (document.querySelectorAll("input:invalid").length == 0) {
        /* REQUEST PART */
        let xhr = new XMLHttpRequest();
        xhr.open('POST', `${AWS_BASE_URL}/auth/login`);
        xhr.onload = () => {
            let response = JSON.parse(xhr.responseText);
            if (xhr.status != 200 || response.error) {
                alert("Credenciales inválidas. " + response.error);
            } else {
                if (response.access_token) {
                    sessionStorage.setItem("session-user", response.access_token);
                    window.location.href = "dashboard.html";
                } else {
                    alert("Error al procesar las credenciales.");
                }
            }
        };
        xhr.send(JSON.stringify({
            username: username,
            password: password
        }));
        /*****************/
    } else {
        alert("Llene todos los campos correctamente.");
    }
}