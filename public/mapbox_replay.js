const Mapbox = (function () {
    let instance;

    function MapboxS() {
        this._map = null;
        this.coordinates = document.getElementById('coordinates');

        this._initMap();
    }

    MapboxS.prototype._initMap = function () {
        mapboxgl.accessToken = mapboxToken;
        this._map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [1.5, 46.5],
            zoom: 5,
        });

        this._map.loadImage('/images/markers/bot.png', (error, image) => {
            if (error) throw error;
            this._map.addImage('bot-marker', image);
        });

        this._map.loadImage('/images/markers/wildfire.png', (error, image) => {
            if (error) throw error;
            this._map.addImage('wildfire-marker', image);
        });

        this._map.on('mousemove', (e) => {
            const {lng, lat} = e.lngLat;
            this.coordinates.textContent = `lng: ${lng.toFixed(4)}, lat: ${lat.toFixed(4)}`;
        });

        this._map.on('load', async () => {
        });
    };

    return {
        getInstance: function () {
            if (!instance) {
                instance = new MapboxS();
            }
            return instance;
        }
    };
})();

const mapbox = Mapbox.getInstance();

const botMarkers = [];

let destinationMarker = null;

const templateBot = document.getElementById('template-panel-bot');

const navSteps = [];

class Settings {
    constructor() {
        this.timeAcceleration = 1;
        this.isPaused = false;
    }

    static getInstance() {
        if (!Settings.instance) {
            Settings.instance = new Settings();
        }
        return Settings.instance;
    }

    setTimeAcceleration(timeAcceleration) {
        this.timeAcceleration = timeAcceleration;
    }

    getTimeAcceleration() {
        return this.timeAcceleration;
    }

    setIsPaused(paused) {
        this.isPaused = paused;
    }

    getIsPaused() {
        return this.isPaused;
    }
}

data.assignments.forEach((assignment, index) => {
    const departureCoordinates = {
        latitude: assignment.geojson.routes[0].geometry.coordinates[0][1],
        longitude: assignment.geojson.routes[0].geometry.coordinates[0][0]
    }

    const destinationCoordinates = {
        latitude: assignment.geojson.routes[0].geometry.coordinates[assignment.geojson.routes[0].geometry.coordinates.length - 1][1],
        longitude: assignment.geojson.routes[0].geometry.coordinates[assignment.geojson.routes[0].geometry.coordinates.length - 1][0]
    }

    const departureMarkerEl = document.createElement('div');
    departureMarkerEl.className = 'bot-marker';

    //create marker for departure and destination
    const departureMarker = new mapboxgl.Marker(departureMarkerEl)
        .setLngLat([departureCoordinates.longitude, departureCoordinates.latitude])
        .addTo(mapbox._map);

    botMarkers.push({
        botId: assignment.botId,
        marker: departureMarker
    });

    navSteps.push({
        botId: assignment.botId,
        step: 0,
        assignmentIndex: index
    })

    if (!destinationMarker) {
        const destinationMarkerEl = document.createElement('div');
        destinationMarkerEl.className = 'wildfire-marker';
        destinationMarkerEl.addEventListener('click', function () {
            //fly to the destination
            mapbox._map.flyTo({
                center: [destinationCoordinates.longitude, destinationCoordinates.latitude],
                zoom: 15,
                speed: 2
            });
        });

        destinationMarker = new mapboxgl.Marker(destinationMarkerEl)
            .setLngLat([destinationCoordinates.longitude, destinationCoordinates.latitude])
            .addTo(mapbox._map);
    }

    //create a line with geojson.routes[0].geometry.coordinates
    const route = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: assignment.geojson.routes[0].geometry.coordinates
        }
    };

    mapbox._map.on('load', function () {
        mapbox._map.addLayer({
            id: 'route' + assignment.id,
            type: 'line',
            source: {
                type: 'geojson',
                data: route
            },
            layout: {
                'line-join': 'round',
                'line-cap': 'round'
            },
            paint: {
                'line-color': '#888',
                'line-width': 4
            }
        });
    });


    // clone the template panel
    const panel = templateBot.cloneNode(true);
    panel.id = 'panel-bot-' + assignment.botId;
    panel.dataset.id = assignment.botId;
    panel.querySelector('.panel-bot-id').textContent = assignment.botId;
    panel.classList.remove('hidden');
    panel.addEventListener('click', function () {
        const panelId = parseInt(this.dataset.id);
        const marker = botMarkers.find((bot) => bot.botId === panelId).marker;
        mapbox._map.flyTo({
            center: marker.getLngLat(),
            zoom: 15,
            speed: 2
        });
    });
    document.querySelector('#bots-panel .panel-body').appendChild(panel);

    progressNavigation(assignment.botId);
});

function progressNavigation(botId) {
    if (Settings.getInstance().getIsPaused()) {
        return;
    }
    const navStep = navSteps.find((step) => step.botId === botId);
    if (navStep) {
        let geojsonSteps = data.assignments[navStep.assignmentIndex].geojson.routes[0].geometry.coordinates;
        let duration = data.assignments[navStep.assignmentIndex].geojson.routes[0].duration / geojsonSteps.length;

        if (geojsonSteps) {
            if (navStep.step === geojsonSteps.length - 1) {
                Settings.getInstance().setIsPaused(checkIfAllBotArrived());
                return;
            } else {
                navStep.step++;
            }

            moveBot(botId, {
                latitude: geojsonSteps[navStep.step][1],
                longitude: geojsonSteps[navStep.step][0]
            });

            setTimeout(() => {
                return progressNavigation(botId);
            }, duration * 1000 / Settings.getInstance().getTimeAcceleration());
        }
    }
}

function moveBot(botId, coordinates) {
    const marker = botMarkers.find((bot) => bot.botId === botId).marker;
    marker.setLngLat([coordinates.longitude, coordinates.latitude]);
}

function checkIfAllBotArrived() {
    const isAllBotArrived = navSteps.every((step) => step.step === data.assignments[step.assignmentIndex].geojson.routes[0].geometry.coordinates.length - 1);
    document.querySelector('#isPaused').checked = isAllBotArrived;

    return isAllBotArrived;
}

document.querySelector('#timeAcceleration').addEventListener('input', function () {
    //check if its number
    if (isNaN(this.value)) {
        return;
    } else if (this.value < 1) {
        this.value = 1;
    }
    Settings.getInstance().setTimeAcceleration(this.value);
});

document.querySelector('#isPaused').addEventListener('change', (e) => {
    Settings.getInstance().setIsPaused(e.target.checked);
    if (!e.target.checked) {
        data.assignments.forEach((assignment, index) => {
            progressNavigation(assignment.botId);
        });
    }
});

document.querySelector('#reload').addEventListener('click', () => {
    document.querySelector('#isPaused').checked = false;
    Settings.getInstance().setIsPaused(false);
    // reset the bot markers
    navSteps.forEach((navStep) => {
        navStep.step = 0;

        const departureCoordinates = {
            latitude: data.assignments[navStep.assignmentIndex].geojson.routes[0].geometry.coordinates[0][1],
            longitude: data.assignments[navStep.assignmentIndex].geojson.routes[0].geometry.coordinates[0][0]
        }

        moveBot(navStep.botId, departureCoordinates);

        progressNavigation(navStep.botId);
    });
});



