import axios from "axios";

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
    }
    
};

export default DigitrafficService;
