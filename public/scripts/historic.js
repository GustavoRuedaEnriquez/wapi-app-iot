'use strict'
let network = {};

const LUMINOSITY_COLOR = "#039114";
const TEMP_OUTER_COLOR = "#d91d0f";
const TEMP_INNER_COLOR = "#d67922";
const HUMIDITY_OUTER_COLOR = "#4cc6cf";
const HUMIDITY_INNER_COLOR = "#7213d1";

const luminosity_checkbox        = document.getElementById('luminosity');
const inner_temperature_checkbox = document.getElementById('inner_temperature');
const outer_temperature_checkbox = document.getElementById('outer_temperature');
const inner_humidity_checkbox    = document.getElementById('inner_humidity');
const outer_humidity_checkbox    = document.getElementById('outer_humidity');

let luminosity_datapoints = [{x: 2006, y: 15},
                             {x: 2007, y: 15},
                             {x: 2008, y: 15},
                             {x: 2009, y: 15},
                             {x: 2010, y: 15},
                             {x: 2011, y: 15},
                             {x: 2012, y: 15},
                             {x: 2013, y: 15},
                             {x: 2014, y: 15}];

let inner_temperature_datapoints = [{x: 2006, y: 20},
                                    {x: 2007, y: 20},
                                    {x: 2008, y: 20},
                                    {x: 2009, y: 20},
                                    {x: 2010, y: 20},
                                    {x: 2011, y: 20},
                                    {x: 2012, y: 20},
                                    {x: 2013, y: 20},
                                    {x: 2014, y: 20 }];

let outer_temperature_datapoints = [{x: 2006, y: 27},
                                    {x: 2007, y: 27},
                                    {x: 2008, y: 27},
                                    {x: 2009, y: 27},
                                    {x: 2010, y: 27},
                                    {x: 2011, y: 27},
                                    {x: 2012, y: 27},
                                    {x: 2013, y: 27},
                                    {x: 2014, y: 27}];

let inner_humidity_datapoints = [{x: 2006, y: 36},
                                 {x: 2007, y: 36},
                                 {x: 2008, y: 36},
                                 {x: 2009, y: 36},
                                 {x: 2010, y: 36},
                                 {x: 2011, y: 36},
                                 {x: 2012, y: 36},
                                 {x: 2013, y: 36},
                                 {x: 2014, y: 36}];

let outer_humidity_datapoints = [{x: 2006, y: 76},
                                 {x: 2007, y: 76},
                                 {x: 2008, y: 76},
                                 {x: 2009, y: 76},
                                 {x: 2010, y: 76},
                                 {x: 2011, y: 76},
                                 {x: 2012, y: 76},
                                 {x: 2013, y: 76},
                                 {x: 2014, y: 76}];


let luminosity = {
    visible: luminosity_checkbox.checked,
    type: "line",
    name: "Luminosidad",
    color: LUMINOSITY_COLOR,
    toolTipContent: `<span style="color:${LUMINOSITY_COLOR};margin=0px; padding=0px;">Luminosidad: {y} LUMENS</span>`,
    xValueFormatString: "####",
    dataPoints : luminosity_datapoints
};

let inner_temperature = {
    visible: inner_temperature_checkbox.checked,
    type: "line",
    name: "Temp. suelo",
    color: TEMP_INNER_COLOR,
    toolTipContent: `<span style="color:${TEMP_INNER_COLOR};margin=0px; padding=0px;">Temp. suelo: {y} °C</span>`,
    xValueFormatString: "####",
    dataPoints : inner_temperature_datapoints
}

let outer_temperature = {
    visible: outer_temperature_checkbox.checked,
    type: "line",
    name: "Temp. ambiental",
    color: TEMP_OUTER_COLOR,
    toolTipContent: `<span style="color:${TEMP_OUTER_COLOR}">Temp. ambiental: {y} °C</span>`,
    xValueFormatString: "####",
    dataPoints : outer_temperature_datapoints
}

let inner_humidity = {
    visible: inner_humidity_checkbox.checked,
    type: "line",
    name: "H. suelo",
    color: HUMIDITY_INNER_COLOR,
    toolTipContent: `<span style="color:${HUMIDITY_INNER_COLOR}">H. suelo: {y}%</span>`,
    xValueFormatString: "####",
    dataPoints : inner_humidity_datapoints   
}

let outer_humidity = {
    visible: outer_humidity_checkbox.checked,
    type: "line",
    name: "H. ambiental",
    color: HUMIDITY_OUTER_COLOR,
    toolTipContent: `<span style="color:${HUMIDITY_OUTER_COLOR}">H. ambiental: {y}%</span>`,
    xValueFormatString: "####",
    dataPoints : outer_humidity_datapoints
}

let chart = new CanvasJS.Chart("chartContainer", {
    toolTip: {
        shared: true
    },
    axisX: {
        valueFormatString: "####",
        interval: 1
    },
    axisY: {
        title: "(°C/%/Luxes)",
        maximum: 100,
        lineColor: "#000000",
        titleFontColor: "#000000",
        labelFontColor: "#000000"
    },
    data: [luminosity, inner_temperature, outer_temperature, inner_humidity, outer_humidity]
});

window.onload = function () {
    chart.render();
}

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

function updateHTML(sessionUser){
    let select = document.getElementById('monitors');
    let option;
    for(let i = 1; i <= sessionUser.monitors_num; i++){
        option = document.createElement('option');
        option.appendChild(document.createTextNode(`Monitor ${i}`));
        option.value = `${i}`;
        select.append(option);
    }
}

function init(){
    let sessionUser = JSON.parse(sessionStorage.getItem("session-user"));
    updateHTML(sessionUser);
    //calculateStatistics();
}

init();