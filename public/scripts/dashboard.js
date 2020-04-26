'use strict'

let sessionUser = JSON.parse(sessionStorage.getItem("session-user"));
let avgLuminosity = 0;
let avgInnerTemp = 0;
let avgOuterTemp = 0;
let avgInnerHumi = 0;
let avgOuterHumi = 0;
let disconnectedSensors = 0;

const AWS_BASE_URL = "https://cyt189a497.execute-api.us-east-1.amazonaws.com/prod";

function sortData(array) {
    let temp = [];
    array.sort((a, b) => a.data_id - b.data_id);
    for (let i = 1; i <= sessionUser.monitors_num; i++) {
        let aux = array.filter((a) => a.sensor_id == i);
        if (aux.length == 1) {
            aux = aux[0];
        } else {
            if (aux != undefined) {
                aux = aux[aux.length - 1];
            }
        }
        temp.push(aux);
    }
    return temp;
}

function updateAverages(data, sessionUser) {
    let undefinedSensors = 0;
    let sumLuminosity = 0;
    let sumInnerTemp = 0;
    let sumOuterTemp = 0;
    let sumInnerHumi = 0;
    let sumOuterHumi = 0;

    let htmlLuminosity = document.getElementById("dashboard-latest-luminosity");
    let htmlInnerTemp = document.getElementById("dashboard-latest-inner-temperature");
    let htmlOuterTemp = document.getElementById("dashboard-latest-outer-temperature");
    let htmlInnerHumi = document.getElementById("dashboard-latest-inner-humidity");
    let htmlOuterHumi = document.getElementById("dashboard-latest-outer-humidity");

    for (let i = 0; i < sessionUser.monitors_num; i++) {
        if (data[i] == undefined) {
            undefinedSensors += 1;
            sumLuminosity += 0;
            sumInnerTemp += 0;
            sumOuterTemp += 0;
            sumInnerHumi += 0;
            sumOuterHumi += 0;
        } else {
            sumLuminosity += data[i].luminosity;
            sumInnerTemp += data[i].inner_temp;
            sumOuterTemp += data[i].outer_temp;
            sumInnerHumi += data[i].inner_humidity;
            sumOuterHumi += data[i].outer_humidity;
        }
    }
    disconnectedSensors = undefinedSensors;
    if (undefinedSensors >= sessionUser.monitors_num) {
        avgLuminosity = 0;
        avgInnerTemp = 0;
        avgOuterTemp = 0;
        avgInnerHumi = 0;
        avgOuterHumi = 0;
        updateMeasureDate(undefined);
    } else {
        avgLuminosity = sumLuminosity / (sessionUser.monitors_num -  undefinedSensors);
        avgInnerTemp = sumInnerTemp / (sessionUser.monitors_num -  undefinedSensors);
        avgOuterTemp = sumOuterTemp / (sessionUser.monitors_num -  undefinedSensors);
        avgInnerHumi = sumInnerHumi / (sessionUser.monitors_num -  undefinedSensors);
        avgOuterHumi = sumOuterHumi / (sessionUser.monitors_num -  undefinedSensors);
        updateMeasureDate(data[0].data_id);
    }
    /* Change the HTML values */
    htmlLuminosity.innerText = `${avgLuminosity.toFixed(1)}`;
    htmlInnerTemp.innerText = `${avgInnerTemp.toFixed(1)}`;
    htmlOuterTemp.innerText = `${avgOuterTemp.toFixed(1)}`;
    htmlInnerHumi.innerText = `${avgInnerHumi.toFixed(1)}`;
    htmlOuterHumi.innerText = `${avgOuterHumi.toFixed(1)}`;


}

function updateMeasureDate(timestamp) {
    let span = document.getElementById("measure-date");
    let message = "-";
    if (timestamp == undefined) {
        span.innerText = message;
        return;
    } else {
        message = `${getCompleteDateString(timestamp)}`;
    }
    span.innerText = message;
}

function updateTableLatest(sessionUser) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${AWS_BASE_URL}/data/network/${sessionUser.network_id}/latest?monitorNum=${sessionUser.monitors_num}`);
    xhr.onload = () => {
        if (xhr.status != 200) {
            let response = JSON.parse(xhr.responseText);
            //console.log(response);
            alert(xhr.status + ': ' + xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
        } else {
            let response = JSON.parse(xhr.responseText);
            let data = response.body.Items;
            /* Sort the data */
            data = sortData(data);
            /* Update the HTML averages */
            updateAverages(data, sessionUser);
            /* Suggest actions */

        }
    };
    xhr.send();
}

function init() {
    updateTableLatest(sessionUser);
}

init()