const Bots = (function () {
    let instance;

    function BotsS() {
        this._panel = document.getElementById('bots-panel');
        this._body = this._panel.querySelector('.panel-body');
        this._template = document.getElementById('template-panel-bot');
        this._bots = [];
        this._init();
    }

    BotsS.prototype._init = function () {
        this.fetch().then(bots => {
            this._bots = bots;
            bots.forEach(bot => {
                this.addToPanel(bot);
            });
        });
    }

    BotsS.prototype.fetch = function () {
        return new Promise((resolve) => {
            fetch(`${BACKEND_URL}/bots`).then(response => response.json()).then(bots => {
                resolve(bots.data.results);
            });
        });
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
            await this.addBotsLayer();

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
        console.log(this._bot.Coordinates[this._bot.Coordinates.length - 1]);
        Mapbox.getInstance().getMap().getSource('bots-source').setData(
            {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [this._bot.Coordinates[this._bot.Coordinates.length - 1].longitude, this._bot.Coordinates[this._bot.Coordinates.length - 1].latitude],
                        },
                    },
                ],
            }
        );
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
        });
    }
}

new Realtime();

