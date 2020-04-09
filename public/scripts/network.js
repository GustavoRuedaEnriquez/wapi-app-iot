'use strict'

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

function updateTable(sessionUser) {

    let tableBody = document.getElementById('network-table-body');
    let tr;
    let th;
    let td;
    
    /* TODO: MAKE THE REQUEST */

    for(let i = 1; i <= sessionUser.monitors_num; i++){
        tr = document.createElement('tr');

        th = document.createElement('th');
        th.scope = 'row';
        th.appendChild(document.createTextNode(`${i}`));
        tr.append(th);

        /* NETWORK STATUS */
        td = document.createElement('td');
        td.appendChild(document.createTextNode('En línea'));
        tr.append(td);

        /* LUMINOSITY */
        td = document.createElement('td');
        td.appendChild(document.createTextNode('34 luxes'));
        tr.append(td);

        /* INNER_TEMPERATURE */
        td = document.createElement('td');
        td.appendChild(document.createTextNode('34°C'));
        tr.append(td);

        /* OUTER_TEMPERATURE */
        td = document.createElement('td');
        td.appendChild(document.createTextNode('24°C'));
        tr.append(td);

        /* INNER_HUMIDITY */
        td = document.createElement('td');
        td.appendChild(document.createTextNode('24%'));
        tr.append(td);

        /* OUTER_HUMIDITY */
        td = document.createElement('td');
        td.appendChild(document.createTextNode('24%'));
        tr.append(td);

        tableBody.append(tr);
    }
}

function init() {
    let sessionUser = JSON.parse(sessionStorage.getItem("session-user"));
    updateHours(sessionUser);
    updateTable(sessionUser);
}

init();