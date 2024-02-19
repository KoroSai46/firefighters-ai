const Bots = (function () {
    let instance;

    function BotsS() {
        this._panel = document.getElementById('bots-panel');
        this._body = this._panel.querySelector('.panel-body');
        this._template = document.getElementById('template-panel-bot');
        this._bots = [];
        this._botsMarkers = [];
        this._geogson = {
            type: 'FeatureCollection',
            features: [],
        };
        this._init();
    }

    BotsS.prototype._init = function () {

    }

    BotsS.prototype.addToPanel = function (bot) {
        let clone = this._template.cloneNode(true);
        clone.classList.remove('hidden');
        clone.id = '';
        clone.dataset.id = bot.id;
        clone.querySelector('.panel-bot-id').textContent = bot.id;
        clone.addEventListener('click', () => {
            console.log(bot);
        });
        this._body.appendChild(clone);
    };

    BotsS.prototype.removeFromPanel = function (id) {
        let panelBot = this._panel.querySelector(`[data-id="${id}"]`);
        if (panelBot) {
            panelBot.remove();
        }
    }

    BotsS.prototype.clearPanel = function () {
        this._body.innerHTML = '';
    }

    BotsS.prototype.getGeojson = function () {
        return this._geogson;
    }

    BotsS.prototype.updateBots = function (updatedBots) {
        updatedBots = updatedBots.results;

        updatedBots.forEach(bot => {
            if (this._bots.find(b => b.id === bot.id)) {
                this._bots.find(b => b.id === bot.id).Coordinates.push(bot.Coordinates[bot.Coordinates.length - 1]);
                this._geogson.features.find(b => b.properties.id === bot.id).geometry.coordinates = [bot.Coordinates[bot.Coordinates.length - 1].longitude, bot.Coordinates[bot.Coordinates.length - 1].latitude];
            } else {
                this._bots.push(bot);
                this.addToPanel(bot);
                Mapbox.getInstance().addBot(bot);
            }
        });

        for (const bot in this._bots) {
            if (!updatedBots.find(b => b.id === bot.id)) {
                this.removeFromPanel(bot.id);
                this._bots = this._bots.filter(b => b.id !== bot.id);
                this._geogson.features = this._geogson.features.filter(b => b.properties.id !== bot.id);
                Mapbox.getInstance().getBotManager(bot.id);
            }
        }

        Mapbox.getInstance().drawMarkers();
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = new BotsS();
            }
            return instance;
        }
    };
}());

const Wildfires = (function () {
    let instance;

    function WildfiresS() {
        this._panel = document.getElementById('wildfires-panel');
        this._body = this._panel.querySelector('.panel-body');
        this._template = document.getElementById('template-panel-wildfire');
    }

    WildfiresS.prototype._init = function () {
        this.fetch().then(wildfires => {
            wildfires.forEach(wildfire => {
                this.add(wildfire);
            });
        });
    }

    WildfiresS.prototype.fetch = function () {
        return new Promise((resolve) => {
            fetch(`${BACKEND_URL}/wildfires`).then(response => response.json()).then(wildfires => {
                resolve(wildfires.data.results);
            });
        });
    }

    WildfiresS.prototype.add = function (wildfire) {
        let clone = this._template.cloneNode(true);
        clone.classList.remove('hidden');
        clone.id = '';
        clone.dataset.id = wildfire.id;
        clone.querySelector('.panel-wildfire-id').textContent = wildfire.id;
        clone.addEventListener('click', () => {
            console.log(wildfire);
        });
        this._body.appendChild(clone);
    };

    WildfiresS.prototype.remove = function (id) {
        let panelWildfire = this._panel.querySelector(`[data-id="${id}"]`);
        if (panelWildfire) {
            panelWildfire.remove();
        }
    }

    WildfiresS.prototype.clear = function () {
        this._body.innerHTML = '';
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = new WildfiresS();
            }
            return instance;
        }
    };
}());

const Mapbox = (function () {
    let instance;

    function MapboxS() {
        this._map = null;
        this._wildfireManagers = [];
        this._botManagers = [];
        this._onMapReady = () => {
        };
        this.coordinates = document.getElementById('coordinates');
        this._initMap();
    }

    MapboxS.prototype._initMap = function () {
        mapboxgl.accessToken = 'pk.eyJ1IjoieWhhb3VydCIsImEiOiJjbHFjZXRnZXgwMWZxMnFwanh1MnNxMzF3In0.NcuusOQX2gN1qVCYs_304w';
        this._map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [1.532917, 45.159722],
            zoom: 13,
        });

        this._map.on('mousemove', (e) => {
            const {lng, lat} = e.lngLat;
            this.coordinates.textContent = `lng: ${lng.toFixed(4)}, lat: ${lat.toFixed(4)}`;
        });

        this._map.on('load', async () => {
            await this.stylize();
            await this.draw();
            this._onMapReady();
        });
    };

    MapboxS.prototype.onMapReady = function (callback) {
        this._onMapReady = callback;
    };

    MapboxS.prototype.getMap = function () {
        return this._map;
    }

    MapboxS.prototype.addWildfire = function (wildfire) {
        let wildfireManager = new WildfireManager(wildfire);
        this._wildfireManagers.push(wildfireManager);
        Wildfires.getInstance().add(wildfire);
    };

    MapboxS.prototype.addWildfireState = function (wildfireState) {
        let wildfireManager = this.getWildfireManager(wildfireState.id);
        wildfireManager.addState(wildfireState);
    }

    MapboxS.prototype.getWildfireManager = function (id) {
        return this._wildfireManagers.find(manager => manager._wildfire.id === id);
    };

    MapboxS.prototype.addBot = function (bot) {
        let botManager = new BotManager(bot);
        this._botManagers.push(botManager);
    }

    MapboxS.prototype.getBotManager = function (id) {
        return this._botManagers.find(manager => manager._bot.id === id);
    }

    MapboxS.prototype.stylize = function () {
        return new Promise((resolve) => {
            this._map.loadImage('/images/markers/bot.png', (error, image) => {
                if (error) throw error;
                this._map.addImage('bot-marker', image);
            });

            resolve();
        });
    }

    MapboxS.prototype.draw = function () {
        return new Promise(async (resolve) => {
            await this.addWildfiresLayer();
            await this.drawMarkers();

            resolve();
        });
    }

    MapboxS.prototype.addWildfiresLayer = function () {
        return new Promise((resolve) => {
            this._map.addSource('wildfires-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                },
            });

            this._map.addLayer({
                id: 'wildfires-layer',
                type: 'fill',
                layout: {},
                paint: {
                    'fill-color': 'red',
                    'fill-opacity': 0.5,
                },
                source: 'wildfires-source',
            });

            resolve();
        });
    }

    MapboxS.prototype.addBotsLayer = function () {
        return new Promise((resolve) => {
            this._map.addSource('bots-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                },
            });

            this._map.addLayer({
                id: 'bots-layer',
                type: 'symbol',
                layout: {
                    'icon-image': 'bot-marker',
                    'icon-size': 0.02,
                },
                source: 'bots-source',
            });

            resolve();
        });
    }

    MapboxS.prototype.drawMarkers = function () {
        //get markers from BotsS
        let botGeojson = Bots.getInstance()._geogson;
        for (const bot of botGeojson.features) {
            //check if bot already has a marker
            if (Bots.getInstance()._botsMarkers.find(marker => marker.id === bot.properties.id)) {
                //update marker lat and long
                Bots.getInstance()._botsMarkers.find(marker => marker.id === bot.properties.id).marker.setLngLat(bot.geometry.coordinates);
            } else {
                let el = document.createElement('div');
                el.dataset.id = bot.properties.id;
                el.className = 'bot-marker';

                let marker = new mapboxgl.Marker(el)
                    .setLngLat(bot.geometry.coordinates)
                    .addTo(this._map);

                Bots.getInstance()._botsMarkers.push({id: bot.properties.id, marker: marker});
            }
        }

        //remove markers that are not in the geojson
        for (const marker of Bots.getInstance()._botsMarkers) {
            if (!botGeojson.features.find(bot => bot.properties.id === marker.id)) {
                marker.marker.remove();
                Bots.getInstance()._botsMarkers = Bots.getInstance()._botsMarkers.filter(bot => bot.id !== marker.id);
            }
        }
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = new MapboxS();
            }
            return instance;
        }
    };
})();

class WildfireManager {
    constructor(wildfire) {
        this._wildfire = wildfire;
        this._init();
    }

    _init() {
        // Mapbox.getInstance().getMap().getSource('wildfire-layer').addSource(`wildfire-source-${this._wildfire.id}`, {
        //     type: 'geojson',
        //     data: {
        //         type: 'Feature',
        //         geometry: {
        //             type: 'Polygon',
        //             coordinates: [],
        //         },
        //     },
        // });
    }

    addState(state) {
        // Mapbox.getInstance().getMap().getSource(`wildfire-source-${this._wildfire.id}`).setData({
        //     type: 'Feature',
        //     geometry: {
        //         type: 'Polygon',
        //         coordinates: [state.points],
        //     },
        // });
    }
}

class BotManager {
    constructor(bot) {
        this._bot = bot;
        this._init();
    }

    _init() {
        //add bot to geojson feature collection from BotsS
        Bots.getInstance()._geogson.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [this._bot.Coordinates[this._bot.Coordinates.length - 1].longitude, this._bot.Coordinates[this._bot.Coordinates.length - 1].latitude],
            },
            properties: {
                title: 'Bot',
                description: 'Bot',
                id: this._bot.id,
            },
        });

        //update source
        Mapbox.getInstance().drawMarkers();
    }
}

class Realtime {
    constructor() {
        this._mapbox = Mapbox.getInstance();
        this._init();
    }

    _init() {
        this._mapbox.onMapReady((mapbox) => {

            Bots.getInstance();
            Wildfires.getInstance();

            const socket = io(BACKEND_URL);

            socket.on('fire:start', (data) => {
                mapbox.addWildfire(data);
            });

            socket.on('fire:update', (data) => {
                mapbox.addWildfireState(data);
            });

            socket.on('bots:update', (data) => {
                Bots.getInstance().updateBots(data);
            });

            setInterval(() => {

                Mapbox.getInstance().drawMarkers();
            }, 1000);
        });
    }
}

new Realtime();

