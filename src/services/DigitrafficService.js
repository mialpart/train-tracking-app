import axios from "axios";
import moment from 'moment';


//TODO:
//Tänne voisi tehdä haun asemille: https://rata.digitraffic.fi/api/v1/metadata/stations
//Train trackingilla edellinen ja seuraava asema:
//Kaikki junat: https://rata.digitraffic.fi/api/v1/train-tracking?version=65403053026
//Yksi juna: https://rata.digitraffic.fi/api/v1/train-tracking/2021-10-19/73?version=1000
//Timetablet löytyy täältä: https://rata.digitraffic.fi/api/v1/trains/latest/10457
const DigitrafficService = {
    getLatestCoordinate: function(value) {
        var url = "https://rata.digitraffic.fi/api/v1/train-locations/latest/" + value;
        return axios.get(url).then(data => {
            return data.data;
        }).catch(error => {
            console.error(error);
        })
    },

    getLatestCoordinateAll: function() {
        var url = "https://rata.digitraffic.fi/api/v1/train-locations/latest/";
        return axios.get(url).then(data => {
            return data.data;
        }).catch(error => {
            console.error(error);
        })
    },

    getLatestTrainInfo: function(value) {
        var url = "https://rata.digitraffic.fi/api/v1/trains/latest/" + value;
        return axios.get(url).then(data => {
            return data.data;
        }).catch(error => {
            console.error(error);
        })
    },

    getAllTrainInfoToday: function() {
        let date = moment().format('YYYY-MM-DD');
        var url = "https://rata.digitraffic.fi/api/v1/trains/" + date;
        return axios.get(url).then(data => {
            return data.data;
        }).catch(error => {
            console.error(error);
        })
    }
    
};

export default DigitrafficService;
