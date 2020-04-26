'use strict'

function  getCompleteDateString(timestamp) {
    let m = moment(timestamp);
    return `${m.get('date')} de ${getMonthNameSpanish(m.get('month'))} del ${m.get('year')} a las ${m.format("HH:mm")}hrs`;
}

function getTitle(startTimestamp, endTimestamp, timeMeasure) {
    let title = "";
    switch (timeMeasure) {
        case "day":
            title = moment(startTimestamp).local().format("DD/MM/YYYY");
            break;
        case "week":
            title = moment(startTimestamp).local().format("DD/MM/YYYY") + " - " + moment(endTimestamp).local().format("DD/MM/YYYY");
            break;
        case "month":
            title = getMonthNameSpanish(moment(startTimestamp).local().month()) + " " + moment(startTimestamp).local().format("YYYY");
            break;
        case "year":
            title = moment(startTimestamp).local().format("YYYY");
            break;
        default:
            break;
    }
    return title;
}

function getMonthNameSpanish(month) {
    switch (month) {
        case 0:
            return "Enero";
        case 1:
            return "Febrero";
        case 2:
            return "Marzo";
        case 3:
            return "Abril";
        case 4:
            return "Mayo";
        case 5:
            return "Junio";
        case 6:
            return "Julio";
        case 7:
            return "Agosto";
        case 8:
            return "Septiembre";
        case 9:
            return "Octubre";
        case 10:
            return "Noviembre";
        case 11:
            return "Diciembre";
    }
}