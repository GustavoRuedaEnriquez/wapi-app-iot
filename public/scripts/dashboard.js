'use strict'

let sessionUser = JSON.parse(sessionStorage.getItem("session-user"));
let avgLuminosity = 0;
let avgInnerTemp = 0;
let avgOuterTemp = 0;
let avgInnerHumi = 0;
let avgOuterHumi = 0;
let disconnectedSensors = 0;

let sensorsDisconnectedArray = [];
let sensorsWithBadLuminosity = [];
let sensorsWithInnerTemp = [];
let sensorsWithOuterTemp = [];
let sensorsWithInnerHumi = [];
let sensorsWithOuterHumi = [];

const AWS_BASE_URL = "https://cyt189a497.execute-api.us-east-1.amazonaws.com/prod";

function sortData(array) {
    let temp = [];
    let temp2 = [];
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
    
    let bottom = moment(temp[0].data_id).subtract(10, 'minutes').valueOf();
    temp = temp.filter(x => x !== undefined);
    temp = temp.filter(x => x.data_id >= bottom);

    for (let i = 1; i <= sessionUser.monitors_num; i++) {
        let singleData = temp.find(a => a.sensor_id == i);
        temp2.push(singleData);
    }
    return temp2;
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

    sensorsDisconnectedArray = [];
    sensorsWithBadLuminosity = [];
    sensorsWithInnerTemp = [];
    sensorsWithOuterTemp = [];
    sensorsWithInnerHumi = [];
    sensorsWithOuterHumi = [];

    for (let i = 0; i < sessionUser.monitors_num; i++) {
        if (data[i] == undefined) {
            undefinedSensors += 1;
            sensorsDisconnectedArray.push(i + 1);
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

            if(data[i].luminosity < (data[i].optimal_luminosity - data[i].error_luminosity) ||  data[i].luminosity > (data[i].optimal_luminosity + data[i].error_luminosity)) {
                sensorsWithBadLuminosity.push(i + 1);
            }
            
            if(data[i].inner_temp < (data[i].optimal_inner_temp - data[i].error_inner_temp) ||  data[i].inner_temp > (data[i].optimal_inner_temp + data[i].error_inner_temp)) {
                sensorsWithInnerTemp.push(i + 1);
            }
            
            if(data[i].outer_temp < (data[i].optimal_outer_temp - data[i].error_outer_temp) ||  data[i].outer_temp > (data[i].optimal_outer_temp + data[i].error_outer_temp)) {
                sensorsWithOuterTemp.push(i + 1);
            }

            if(data[i].inner_humidity < (data[i].optimal_inner_humidity - data[i].error_inner_humidity) ||  data[i].inner_humidity > (data[i].optimal_inner_humidity + data[i].error_inner_humidity)) {
                sensorsWithInnerHumi.push(i + 1);
            }

            if(data[i].outer_humidity < (data[i].optimal_outer_humidity - data[i].error_outer_temp) ||  data[i].outer_humidity > (data[i].optimal_outer_humidity + data[i].error_outer_temp)) {
                sensorsWithOuterHumi.push(i + 1);
            }
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

function fillSuggestions() {
    let scrollDiv = document.getElementById("scrollable-actions-div");
    let statusTitle = document.getElementById("status-title");
    let statusImage = document.getElementById("status-images");
    let count = 0;
    for(let i = 0; i < sensorsDisconnectedArray.length; i++) {
        let p = document.createElement('p');
        let hr = document.createElement('hr');
        p.innerText = `Revisar conexión del sensor ${sensorsDisconnectedArray[i]}`;
        scrollDiv.append(p);
        scrollDiv.append(hr);
        count++;
    }

    for(let i = 0; i < sensorsWithBadLuminosity.length; i++) {
        let p = document.createElement('p');
        let hr = document.createElement('hr');
        p.innerText = `Luminosidad del sensor ${sensorsWithBadLuminosity[i]} anormal.`;
        scrollDiv.append(p);
        scrollDiv.append(hr);
        count++;
    }

    for(let i = 0; i < sensorsWithInnerTemp.length; i++) {
        let p = document.createElement('p');
        let hr = document.createElement('hr');
        p.innerText = `Temp. del suelo del sensor ${sensorsWithInnerTemp[i]} anormal.`;
        scrollDiv.append(p);
        scrollDiv.append(hr);
        count++;
    }

    for(let i = 0; i < sensorsWithOuterTemp.length; i++) {
        let p = document.createElement('p');
        let hr = document.createElement('hr');
        p.innerText = `Temp. ambiental del sensor ${sensorsWithOuterTemp[i]} anormal.`;
        scrollDiv.append(p);
        scrollDiv.append(hr);
        count++;
    }

    for(let i = 0; i < sensorsWithInnerHumi.length; i++) {
        let p = document.createElement('p');
        let hr = document.createElement('hr');
        p.innerText = `Humedad del suelo del sensor ${sensorsWithInnerHumi[i]} anormal.`;
        scrollDiv.append(p);
        scrollDiv.append(hr);
        count++;
    }

    for(let i = 0; i < sensorsWithOuterHumi.length; i++) {
        let p = document.createElement('p');
        let hr = document.createElement('hr');
        p.innerText = `Humedad ambiental del sensor ${sensorsWithOuterHumi[i]} anormal.`;
        scrollDiv.append(p);
        scrollDiv.append(hr);
        count++;
    }

    if(count >= 0 && count <= 5) {
        statusTitle.innerText = "¡Todo en orden!";
        statusImage.src = "./images/WAPI-dashboard-ok.svg";
    }

    if(count >= 6 && count <= 25) {
        statusTitle.innerText = "Precaución, sugerimos actuar";
        statusImage.src = "./images/WAPI-dashboard-warning.svg";
    }

    if(count >= 26 || sensorsDisconnectedArray.length >= (sessionUser.monitors_num * 0.30)) {
        statusTitle.innerText = "Tomar acción de inmediato.";
        statusImage.src = "./images/WAPI-dashboard-error.svg";
    }
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
            fillSuggestions();
        }
    };
    xhr.send();
}

function init() {
    updateTableLatest(sessionUser);
}

init()