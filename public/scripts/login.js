'use strict'

const AWS_BASE_URL = "https://cyt189a497.execute-api.us-east-1.amazonaws.com/prod";

function logIn(evt) {
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    if (document.querySelectorAll("input:invalid").length == 0) {
        /* PETITION PART */
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${AWS_BASE_URL}/users/name/${username}`);
        xhr.onload = () => {
            let response = JSON.parse(xhr.responseText);
            if (xhr.status != 200) {
                alert("Credenciales inválidas.");
            } else {
                if(response.Count == 0) {
                    alert("Credenciales inválidas.");
                } else {
                    if(response.Items[0].password == password) {
                        sessionStorage.setItem("session-user", JSON.stringify(response.Items[0]));
                        window.location.href = "dashboard.html";
                    } else {
                        alert("Credenciales inválidas."); 
                    }
                }
                console.log(response);
            }
        };
        xhr.send();
        /*****************/
    } else {
        alert("Llene todos los campos correctamente.");
    }

}