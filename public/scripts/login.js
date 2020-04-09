'use strict'

let dummyUser = {

    id: 1,
    user_id: 1,
    name: "Salvador Cortez",
    network_id: 1,
    monitors_num: 4,
    sample_frequency: 120

};

function logIn(evt) {
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let str = JSON.stringify({
        'email': email,
        'password': password
    });
    
    if(document.querySelectorAll("input:invalid").length == 0){
            /* PETITION PART */
            sessionStorage.setItem("session-user", JSON.stringify(dummyUser));
            window.location.href = "dashboard.html";
            /*****************/
    } else {
        alert("Llene todos los campos correctamente.");
    }

}