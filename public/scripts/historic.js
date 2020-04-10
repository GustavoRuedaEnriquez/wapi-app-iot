'use strict'

let sessionUser = JSON.parse(sessionStorage.getItem("session-user"));

let timeMeasure = "day";
let monitorSelected = "all";

let start = 0;
let end = 0;
let startTimestamp = 0;
let endTimestamp = 0;

let numOfSamples = 0
let interval = 0;

const AWS_BASE_URL = "https://cyt189a497.execute-api.us-east-1.amazonaws.com/prod";

const LUMINOSITY_COLOR = "#039114";
const TEMP_OUTER_COLOR = "#d91d0f";
const TEMP_INNER_COLOR = "#d67922";
const HUMIDITY_OUTER_COLOR = "#4cc6cf";
const HUMIDITY_INNER_COLOR = "#7213d1";

const luminosity_checkbox = document.getElementById('luminosity');
const inner_temperature_checkbox = document.getElementById('inner_temperature');
const outer_temperature_checkbox = document.getElementById('outer_temperature');
const inner_humidity_checkbox = document.getElementById('inner_humidity');
const outer_humidity_checkbox = document.getElementById('outer_humidity');

let luminosity_datapoints = [];
let inner_temperature_datapoints = [];
let outer_temperature_datapoints = [];
let inner_humidity_datapoints = [];
let outer_humidity_datapoints = [];
let format = "HH:mm";
let intervalType = "hour";


let luminosity = {
    visible: luminosity_checkbox.checked,
    xValueType: "dateTime",
    type: "line",
    name: "Luminosidad",
    color: LUMINOSITY_COLOR,
    toolTipContent: `<span style="color:${LUMINOSITY_COLOR};margin=0px; padding=0px;">Luminosidad: {y} LUMENS</span>`,
    dataPoints: luminosity_datapoints
};

let inner_temperature = {
    visible: inner_temperature_checkbox.checked,
    xValueType: "dateTime",
    type: "line",
    name: "Temp. suelo",
    color: TEMP_INNER_COLOR,
    toolTipContent: `<span style="color:${TEMP_INNER_COLOR};margin=0px; padding=0px;">Temp. suelo: {y} °C</span>`,
    dataPoints: inner_temperature_datapoints
}

let outer_temperature = {
    visible: outer_temperature_checkbox.checked,
    xValueType: "dateTime",
    type: "line",
    name: "Temp. ambiental",
    color: TEMP_OUTER_COLOR,
    toolTipContent: `<span style="color:${TEMP_OUTER_COLOR}">Temp. ambiental: {y} °C</span>`,
    dataPoints: outer_temperature_datapoints
}

let inner_humidity = {
    visible: inner_humidity_checkbox.checked,
    xValueType: "dateTime",
    type: "line",
    name: "H. suelo",
    color: HUMIDITY_INNER_COLOR,
    toolTipContent: `<span style="color:${HUMIDITY_INNER_COLOR}">H. suelo: {y}%</span>`,
    dataPoints: inner_humidity_datapoints
}

let outer_humidity = {
    visible: outer_humidity_checkbox.checked,
    xValueType: "dateTime",
    type: "line",
    name: "H. ambiental",
    color: HUMIDITY_OUTER_COLOR,
    toolTipContent: `<span style="color:${HUMIDITY_OUTER_COLOR}">H. ambiental: {y}%</span>`,
    dataPoints: outer_humidity_datapoints
}

let chart = new CanvasJS.Chart("chartContainer", {
    toolTip: {
        shared: true
    },

    axisX:{
        interval: 1,
        intervalType : "hour",
        valueFormatString: format
    },

    axisY: {
        title: "(°C/%/Luxes)",
        maximum: 150,
        lineColor: "#000000",
        titleFontColor: "#000000",
        labelFontColor: "#000000"
    },
    data: [luminosity, inner_temperature, outer_temperature, inner_humidity, outer_humidity]
});

luminosity_checkbox.addEventListener('change', function (e) {
    luminosity.visible = luminosity_checkbox.checked;
    chart.render();
});

inner_temperature_checkbox.addEventListener('change', function (e) {
    inner_temperature.visible = inner_temperature_checkbox.checked;
    chart.render();
});

outer_temperature_checkbox.addEventListener('change', function (e) {
    outer_temperature.visible = outer_temperature_checkbox.checked;
    chart.render();
});

inner_humidity_checkbox.addEventListener('change', function (e) {
    inner_humidity.visible = inner_humidity_checkbox.checked;
    chart.render();
});

outer_humidity_checkbox.addEventListener('change', function (e) {
    outer_humidity.visible = outer_humidity_checkbox.checked;
    chart.render();
});

function getHoursSamples(sessionUser) {
    let hours = 0;
    let minutes = 0;
    let hoursIncrement = Math.floor(sessionUser.sample_frequency / 60);
    let minutesIncrement = sessionUser.sample_frequency % 60;
    let intervals = 1;
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
        intervals = intervals + 1;
    }
    return intervals;
}

function updateHTML(sessionUser) {
    let select = document.getElementById('monitors');
    let option;
    for (let i = 1; i <= sessionUser.monitors_num; i++) {
        option = document.createElement('option');
        option.appendChild(document.createTextNode(`Monitor ${i}`));
        option.value = `${i}`;
        select.append(option);
    }
}

function calculateEPOCHRange(timeMeasure) {
    start = moment().startOf(timeMeasure);
    end = moment().endOf(timeMeasure);
    startTimestamp = start.valueOf();
    endTimestamp = end.valueOf();
    /* RECALCULATE INTERVALS AND FORMATS  */
    switch (timeMeasure) {
        case "day":
            numOfSamples = getHoursSamples(sessionUser);
            interval = sessionUser.sample_frequency / 60;
            format = "HH:mm";
            intervalType = "hour";
            break;
        case "week":
            numOfSamples = 7;
            interval = 1;
            format = "DDD DD";
            intervalType = "day";
            break;
        case "month":
            numOfSamples = moment().daysInMonth();
            interval = 1;
            format = "DD";
            intervalType = "day";
            break;
        case "year":
            numOfSamples = 12;
            interval = 1;
            format = "MMM";
            intervalType = "month";
            break;
        default:
            break;
    }
    //console.log(start.format());
    //console.log(end.format());
}

function recalculateEPOCHRange() {
    let dateOptions = document.getElementsByName('date');
    for (let i = 0; i < dateOptions.length; i++) {
        if (dateOptions[i].checked) {
            timeMeasure = dateOptions[i].value;
            break;
        }
    }
    //console.log(timeMeasure);
    calculateEPOCHRange(timeMeasure);
}

function getMonitorSelected() {
    let select = document.getElementById("monitors");
    return select.options[select.selectedIndex].value;
}

function obtainMatchingTimestampArray(array) {
    let newArray = [];
    let shiftTimes = 0;
    let pivotElement = {};
    for (let i = 0; i < array.length; i++) {
        if (i == 0) {
            pivotElement = array[i];
            shiftTimes = 1;
            continue;
        }
        switch (timeMeasure) {
            case "day":
                if (pivotElement.data_id == Math.floor((array[i].data_id) / 1000) * 1000) {
                    shiftTimes = shiftTimes + 1;
                }
                break;
            case "week":
                if (moment(pivotElement.data_id).day() == moment(array[i].data_id).day()) {
                    shiftTimes = shiftTimes + 1;
                }
                break;
            case "month":
                if (moment(pivotElement.data_id).date() == moment(array[i].data_id).date()) {
                    shiftTimes = shiftTimes + 1;
                }
                break;
            case "year":
                if (moment(pivotElement.data_id).month() == moment(array[i].data_id).month()) {
                    shiftTimes = shiftTimes + 1;
                }
                break;
            default:
                break;
        }
    }
    for (let i = 0; i < shiftTimes; i++) {
        newArray.push(array.shift());
    }
    return newArray;
}

function getAverageDataForAllMonitors(data, numOfSamples) {
    let disconnectedMonitors = 0;
    let luminosityCount = 0;
    let innerHumidityCount = 0;
    let outerHumidityCount = 0;
    let innerTemperatureCount = 0;
    let outerTemperatureCount = 0;
    let datapointsArray = {
        luminosity: [],
        innerHumidity: [],
        outerHumidity: [],
        innerTemperature: [],
        outerTemperature: []
    }
    let temp = [];
    let tempObject = {};
    data.sort((a, b) => a.data_id - b.data_id);
    //console.log(`data: ${JSON.stringify(data)}`);
    for (let i = 0; i < numOfSamples; i++) {
        temp = obtainMatchingTimestampArray(data);
        //console.log(`data: ${JSON.stringify(data)}`);
        //console.log(`temp: ${JSON.stringify(temp)}`);
        for (let j = 0; j < sessionUser.monitors_num; j++) {
            tempObject = temp.find(a => a.sensor_id == j + 1);
            //console.log(tempObject);
            if (tempObject == undefined) {
                disconnectedMonitors = disconnectedMonitors + 1;
            } else {
                luminosityCount = luminosityCount + tempObject.luminosity;
                innerHumidityCount = innerHumidityCount + tempObject.inner_humidity;
                outerHumidityCount = outerHumidityCount + tempObject.outer_humidity;
                innerTemperatureCount = innerTemperatureCount + tempObject.inner_temp;
                outerTemperatureCount = outerTemperatureCount + tempObject.outer_temp;
            }
        }
        if (disconnectedMonitors < sessionUser.monitors_num) {
            datapointsArray.luminosity.push({
                x: temp[0].data_id,
                y: (luminosityCount / (sessionUser.monitors_num - disconnectedMonitors))
            });
            datapointsArray.innerHumidity.push({
                x: temp[0].data_id,
                y: (innerHumidityCount / (sessionUser.monitors_num - disconnectedMonitors))
            });
            datapointsArray.outerHumidity.push({
                x: temp[0].data_id,
                y: (outerHumidityCount / (sessionUser.monitors_num - disconnectedMonitors))
            });
            datapointsArray.innerTemperature.push({
                x: temp[0].data_id,
                y: (innerTemperatureCount / (sessionUser.monitors_num - disconnectedMonitors))
            });
            datapointsArray.outerTemperature.push({
                x: temp[0].data_id,
                y: (outerTemperatureCount / (sessionUser.monitors_num - disconnectedMonitors))
            });
        }
        disconnectedMonitors = 0;
        luminosityCount = 0;
        innerHumidityCount = 0;
        outerHumidityCount = 0;
        innerTemperatureCount = 0;
        outerTemperatureCount = 0;
        temp = [];
        tempObject = {};
    }
    //console.log(datapointsArray);
    return datapointsArray;
}

function calculateStatisticsAndGraphicate(startTimestamp, endTimestamp, monitorSelected) {

    if (monitorSelected == "all") {
        /* Sending the GET request to obtain the information */
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `${AWS_BASE_URL}/data/network/${sessionUser.network_id}?start=${startTimestamp}&end=${endTimestamp}`);
        xhr.onload = () => {
            if (xhr.status != 200) {
                let response = JSON.parse(xhr.responseText);
                //console.log(response);
                alert(xhr.status + ': ' + xhr.statusText + "/n Un error ha ocurrido, por favor inténtelo después.");
            } else {
                let response = JSON.parse(xhr.responseText);
                let data = response.body.Items;
                //TODO: GET THE AVERAGE FOR EACH MEASURE
                let datapoints = getAverageDataForAllMonitors(data, numOfSamples);
                //TODO: FILL THE DATA POINTS
                luminosity_datapoints = datapoints.luminosity;
                inner_temperature_datapoints = datapoints.innerTemperature;
                outer_temperature_datapoints = datapoints.outerTemperature;
                inner_humidity_datapoints = datapoints.innerHumidity;
                outer_humidity_datapoints = datapoints.outerHumidity;
                luminosity.dataPoints = luminosity_datapoints;
                inner_temperature.dataPoints = inner_temperature_datapoints;
                outer_temperature.dataPoints = outer_temperature_datapoints;
                inner_humidity.dataPoints = inner_humidity_datapoints;
                outer_humidity.dataPoints = outer_humidity_datapoints;
                chart.data = [luminosity, inner_temperature, outer_temperature, inner_humidity, outer_humidity];
                chart.options.axisX.valueFormatString = format;
                chart.options.axisX.intervalType  = interval;
                chart.options.axisX.intervalType = intervalType;
                //TODO: DRAW CHART
                chart.render();
            }
        }
        xhr.send();

    } else {
        //TODO: GET STATS FROM DB
        //TODO: GET THE AVERAGE FOR EACH MEASURE
        //TODO: FILL THE DATA POINTS
        //TODO: DRAW CHART
    }
}

function init() {
    updateHTML(sessionUser);
    calculateEPOCHRange(timeMeasure);
    monitorSelected = getMonitorSelected();
    calculateStatisticsAndGraphicate(startTimestamp, endTimestamp, monitorSelected);
}

function customQuery(evt) {
    recalculateEPOCHRange();
    monitorSelected = getMonitorSelected();
    calculateStatisticsAndGraphicate(startTimestamp, endTimestamp, monitorSelected);
}

init();