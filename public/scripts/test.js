let LUMINOSITY_COLOR = "#039114";
let TEMP_OUTER_COLOR = "#d91d0f";
let TEMP_INNER_COLOR = "#d67922";
let HUMIDITY_OUTER_COLOR = "#4cc6cf";
let HUMIDITY_INNER_COLOR = "#7213d1";

window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer", {
        toolTip: {
            shared: true,
           
        },
        axisX: {
            valueFormatString: "####",
            interval: 1
        },
        axisY: [{
            title: "(°C/%/LUMENS)",
            maximum: 100,
            lineColor: "#000000",
            titleFontColor: "#000000",
            labelFontColor: "#000000"
        }],
        data: [{
                type: "line",
                name:"Luminosidad",
                color: LUMINOSITY_COLOR,
                toolTipContent: `<span style="color:${LUMINOSITY_COLOR};margin=0px; padding=0px;">Luminosidad: {y} LUMENS</span>`,
                xValueFormatString: "####",
                dataPoints: [{
                        x: 2006,
                        y: 15
                    },
                    {
                        x: 2007,
                        y: 3
                    },
                    {
                        x: 2008,
                        y: 20
                    },
                    {
                        x: 2009,
                        y: 10
                    },
                    {
                        x: 2010,
                        y: 30
                    },
                    {
                        x: 2011,
                        y: 10
                    },
                    {
                        x: 2012,
                        y: 60
                    },
                    {
                        x: 2013,
                        y: 20
                    },
                    {
                        x: 2014,
                        y: 2
                    }
                ]
            },
            {
                type: "line",
                name: "Temp. suelo",
                color: TEMP_INNER_COLOR,
                toolTipContent: `<span style="color:${TEMP_INNER_COLOR};margin=0px; padding=0px;">Temp. suelo: {y} °C</span>`,
                xValueFormatString: "####",
                dataPoints: [{
                        x: 2006,
                        y: 12
                    },
                    {
                        x: 2007,
                        y: 20
                    },
                    {
                        x: 2008,
                        y: 28
                    },
                    {
                        x: 2009,
                        y: 34
                    },
                    {
                        x: 2010,
                        y: 24
                    },
                    {
                        x: 2011,
                        y: 45
                    },
                    {
                        x: 2012,
                        y: 15
                    },
                    {
                        x: 2013,
                        y: 34
                    },
                    {
                        x: 2014,
                        y: 22
                    }
                ]
            },
            {
                type: "line",
                name: "Temp. ambiental",
                color: TEMP_OUTER_COLOR,
                toolTipContent: `<span style="color:${TEMP_OUTER_COLOR}">Temp. ambiental: {y} °C</span>`,
                xValueFormatString: "####",
                dataPoints: [{
                        x: 2006,
                        y: 86
                    },
                    {
                        x: 2007,
                        y: 15
                    },
                    {
                        x: 2008,
                        y: 27
                    },
                    {
                        x: 2009,
                        y: 78
                    },
                    {
                        x: 2010,
                        y: 46
                    },
                    {
                        x: 2011,
                        y: 70
                    },
                    {
                        x: 2012,
                        y: 50
                    },
                    {
                        x: 2013,
                        y: 60
                    },
                    {
                        x: 2014,
                        y: 50
                    }
                ]
            },
            {
                type: "line",
                name: "H. suelo",
                color: HUMIDITY_INNER_COLOR,
                toolTipContent: `<span style="color:${HUMIDITY_INNER_COLOR}">H. suelo: {y}%</span>`,
                xValueFormatString: "####",
                dataPoints: [{
                        x: 2006,
                        y: 61
                    },
                    {
                        x: 2007,
                        y: 51
                    },
                    {
                        x: 2008,
                        y: 72
                    },
                    {
                        x: 2009,
                        y: 73
                    },
                    {
                        x: 2010,
                        y: 43
                    },
                    {
                        x: 2011,
                        y: 73
                    },
                    {
                        x: 2012,
                        y: 73
                    },
                    {
                        x: 2013,
                        y: 72
                    },
                    {
                        x: 2014,
                        y: 72
                    }
                ]
            },
            {
                type: "line",
                name: "H. ambiental",
                color: HUMIDITY_OUTER_COLOR,
                toolTipContent: `<span style="color:${HUMIDITY_OUTER_COLOR}">H. ambiental: {y}%</span>`,
                xValueFormatString: "####",
                dataPoints: [{
                        x: 2006,
                        y: 60
                    },
                    {
                        x: 2007,
                        y: 16.8
                    },
                    {
                        x: 2008,
                        y: 24
                    },
                    {
                        x: 2009,
                        y: 72.333
                    },
                    {
                        x: 2010,
                        y: 45
                    },
                    {
                        x: 2011,
                        y: 34
                    },
                    {
                        x: 2012,
                        y: 89
                    },
                    {
                        x: 2013,
                        y: 87
                    },
                    {
                        x: 2014,
                        y: 57
                    }
                ]
            }
        ]
    });

    chart.render();
}