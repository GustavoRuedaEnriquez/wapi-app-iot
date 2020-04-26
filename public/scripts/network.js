'use strict'

let sessionUser = JSON.parse(sessionStorage.getItem("session-user"));

const AWS_BASE_URL = "https://cyt189a497.execute-api.us-east-1.amazonaws.com/prod";

function updateHours(sessionUser) {
    let hours = 0;
    let minutes = 0;
    let hoursIncrement = Math.floor(sessionUser.sample_frequency / 60);
    let minutesIncrement = sessionUser.sample_frequency % 60;

    let select = document.getElementById('hour-input');
    let option;

    option = document.createElement('option');
    option.appendChild(document.createTextNode(`${(hours < 10) ? '0' + hours.toString() : hours.toString()}:${(minutes < 10) ? '0' + minutes.toString() : minutes.toString()}`));
    option.value = `${(hours < 10) ? '0' + hours.toString() : hours.toString()}:${(minutes < 10) ? '0' + minutes.toString() : minutes.toString()}`;
    select.append(option);

    while (!(hours == 23 && minutes + minutesIncrement > 59)) {
        if (hours + hoursIncrement > 23) {
            break;
        } else {
            hours = hours + hoursIncrement;
        }

        minutes = minutes + minutesIncrement;
        if (hours == 23 && minutes >= 60) {
            break;
        }
        if (minutes >= 60) {
            hours = hours + 1;
            minutes = minutes % 60;
        }

        option = document.createElement('option');
        option.appendChild(document.createTextNode(`${(hours < 10) ? '0' + hours.toString() : hours.toString()}:${(minutes < 10) ? '0' + minutes.toString() : minutes.toString()}`));
        option.value = `${(hours < 10) ? '0' + hours.toString() : hours.toString()}:${(minutes < 10) ? '0' + minutes.toString() : minutes.toString()}`;
        select.append(option);
    }
}

function fillRows(data) {
    let tableBody = document.getElementById('network-table-body');
    tableBody.innerHTML = "";
    let tr;
    let th;
    let td;
    let networkStatus;
    let luminosity;
    let inner_temp;
    let outer_temp;
    let inner_humidity;
    let outer_humidity;
    data = data.filter(x => x !== undefined);
    let bottom = moment(data[0].data_id).subtract(10, 'minutes').valueOf();
    data = data.filter(x => x.data_id >= bottom);
    for (let i = 1; i <= sessionUser.monitors_num; i++) {
        let singleData = data.find(a => a.sensor_id == i);
        if (singleData == undefined) {
            networkStatus = "Desconectado";
            luminosity = "-";
            inner_temp = "-";
            outer_temp = "-";
            inner_humidity = "-";
            outer_humidity = "-";
        } else {
            networkStatus = "En línea";
            luminosity = singleData.luminosity;
            inner_temp = singleData.inner_temp;
            outer_temp = singleData.outer_temp;
            inner_humidity = singleData.inner_humidity;
            outer_humidity = singleData.outer_humidity;
        }

        tr = document.createElement('tr');

        th = document.createElement('th');
        th.scope = 'row';
        th.appendChild(document.createTextNode(`${i}`));
        tr.append(th);

        /* NETWORK STATUS */
        td = document.createElement('td');
        if (networkStatus == "Desconectado") {
            td.setAttribute('class', 'table-danger');
        } else {
            td.setAttribute('class', 'table-success');
        }
        td.appendChild(document.createTextNode(`${networkStatus}`));
        tr.append(td);

        /* LUMINOSITY */
        td = document.createElement('td');
        if (luminosity == "-" || luminosity > singleData.optimal_luminosity + singleData.error_luminosity || luminosity < singleData.optimal_luminosity - singleData.error_luminosity) {
            td.setAttribute('class', 'table-danger');
        }
        td.appendChild(document.createTextNode(`${luminosity} luxes`));
        tr.append(td);

        /* INNER_TEMPERATURE */
        td = document.createElement('td');
        if (inner_temp == "-" || inner_temp > singleData.optimal_inner_temp + singleData.error_inner_temp || inner_temp < singleData.optimal_inner_temp - singleData.error_inner_temp) {
            td.setAttribute('class', 'table-danger');
        }
        td.appendChild(document.createTextNode(`${inner_temp} °C`));
        tr.append(td);

        /* OUTER_TEMPERATURE */
        td = document.createElement('td');
        if (outer_temp == "-" || outer_temp > singleData.optimal_outer_temp + singleData.error_outer_temp || outer_temp < singleData.optimal_outer_temp - singleData.error_outer_temp) {
            td.setAttribute('class', 'table-danger');
        }
        td.appendChild(document.createTextNode(`${outer_temp} °C`));
        tr.append(td);

        /* INNER_HUMIDITY */
        td = document.createElement('td');
        if (inner_humidity == "-" || inner_humidity > singleData.optimal_inner_humidity + singleData.error_inner_humidity || inner_humidity < singleData.optimal_inner_humidity - singleData.error_inner_humidity) {
            td.setAttribute('class', 'table-danger');
        }
        td.appendChild(document.createTextNode(`${inner_humidity}%`));
        tr.append(td);

        /* OUTER_HUMIDITY */
        td = document.createElement('td');
        if (outer_humidity == "-" || outer_humidity > singleData.optimal_outer_humidity + singleData.error_outer_humidity || outer_humidity < singleData.optimal_outer_humidity - singleData.error_outer_humidity) {
            td.setAttribute('class', 'table-danger');
        }
        td.appendChild(document.createTextNode(`${outer_humidity}%`));
        tr.append(td);

        tableBody.append(tr);
    }
}

function updateMeasureDate(timestamp) {
    let span = document.getElementById("capture-date");
    let message = "Datos no disponibles";
    if (timestamp == undefined) {
        span.innerText = message;
        return;
    } else {
        message = `Datos capturados ${getCompleteDateString(timestamp)}`;
    }
    span.innerText = message;
}

function updateTableCustom(sessionUser, timestamp) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `${AWS_BASE_URL}/data/network/${sessionUser.network_id}/timestamp?epoch=${timestamp}`);
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
            /* Fill the rows */
            fillRows(data);
            console.log(data);
            /* Update the meassure date */
            if (data == undefined || data == [] || data[0] == undefined) {
                updateMeasureDate(undefined);
            } else {
                updateMeasureDate(data[0].data_id);
            }
        }
        let dateInput = document.getElementById('date-input');
        let today = moment();
        dateInput.value = "";
    };
    xhr.send();
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
            /* Fill the rows */
            fillRows(data);
            /* Update the meassure date */
            updateMeasureDate(data[0].data_id);

        }
        let dateInput = document.getElementById('date-input');
        let today = moment();
        dateInput.value = "";
    };
    xhr.send();
}

function sortData(array) {
    let temp = [];
    /* Sort by timestamp */
    array.sort((a, b) => a.data_id - b.data_id);
    for (let i = 1; i <= sessionUser.monitors_num; i++) {
        let aux = array.filter((a) => a.sensor_id == i);
        if (aux.length == 1) {
            aux = aux[0];
        } else {
            aux = aux[aux.length - 1]
        }
        temp.push(aux);
    }
    return temp;
}

function init() {
    updateHours(sessionUser);
    updateTableLatest(sessionUser);
}

function searchLatest(evt) {
    updateTableLatest(sessionUser);

}

function searchCustom(evt) {
    let dateInput = document.getElementById('date-input');
    let hourInput = document.getElementById('hour-input');
    updateTableCustom(sessionUser, moment(`${dateInput.value} ${hourInput.value}`).valueOf());

}

init();