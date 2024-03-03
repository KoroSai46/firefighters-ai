function openDetailModal(object, clientX, clientY) {
    let modal = document.getElementById('detail-modal');
    let slot = document.getElementById('slot');

    let formatter = new JSONFormatter(object);

    slot.innerHTML = '';
    slot.appendChild(formatter.render());
    modal.style.display = 'block';

    let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    let modalWidth = modal.offsetWidth;
    let adjustedLeft = Math.min(clientX, windowWidth - modalWidth - 100);

    modal.style.left = `${adjustedLeft}px`;
    modal.style.top = `${clientY}px`;
}

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
    }

    BotsS.prototype.add = function (bot) {
        this._bots.push(bot);
        this._geogson.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [bot.Coordinates[bot.Coordinates.length - 1].longitude, bot.Coordinates[bot.Coordinates.length - 1].latitude],
            },
            properties: {
                id: bot.id,
                title: `Bot ${bot.id}`,
                description: bot,
            },
        });

        this.addToPanel(bot);
    }

    BotsS.prototype.remove = function (id) {
        this.removeFromPanel(id);
        this._bots = this._bots.filter(bot => bot.id !== id);
        this._geogson.features = this._geogson.features.filter(bot => bot.properties.id !== id);

        this.callDraw();
    }

    BotsS.prototype.addToPanel = function (bot) {
        let clone = this._template.cloneNode(true);
        clone.classList.remove('hidden');
        clone.id = '';
        clone.dataset.id = bot.id;
        clone.querySelector('.panel-bot-id').textContent = bot.id;
        clone.addEventListener('click', (e) => {
            openDetailModal(bot, e.clientX, e.clientY);
        });
        clone.querySelector('.fly-to').addEventListener('click', (e) => {
            e.stopPropagation();
            Mapbox.getInstance().flyTo(bot.Coordinates[bot.Coordinates.length - 1].longitude, bot.Coordinates[bot.Coordinates.length - 1].latitude);
        })
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

    BotsS.prototype.updateBots = function (updatedBots) {
        updatedBots.forEach(bot => {
            if (this._bots.find(b => b.id === bot.id)) {
                this._bots.find(b => b.id === bot.id).Coordinates.push(bot.Coordinates[0]);
                this._geogson.features.find(b => b.properties.id === bot.id).geometry.coordinates = [bot.Coordinates[0].longitude, bot.Coordinates[0].latitude];
            } else {
                this.add(bot);
            }
        });

        for (const bot in this._bots) {
            if (!updatedBots.find(b => b.id === bot.id)) {
                this.remove(bot.id);
            }
        }

        this.callDraw();
    }

    BotsS.prototype.callDraw = function () {
        const event = new CustomEvent('bots:updated', {detail: 'Bots updated'});
        document.dispatchEvent(event);
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
        this._wildfires = [];
        this._geogson = {
            type: 'FeatureCollection',
            features: [],
        };
    }

    WildfiresS.prototype.add = function (wildfire) {
        this._wildfires.push(wildfire);
        this._geogson.features.push({
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: this.buildPolygonCoordinates(wildfire.Coordinates),
            },
            properties: {
                title: 'Wildfire',
                description: 'Wildfire',
                id: wildfire.id,
            },
        });

        this.addToPanel(wildfire);
    }

    WildfiresS.prototype.remove = function (id) {
        this.removeFromPanel(id);
        this._wildfires = this._wildfires.filter(wildfire => wildfire.id !== id);
        this._geogson.features = this._geogson.features.filter(wildfire => wildfire.properties.id !== id);

        this.callDraw();
    }

    WildfiresS.prototype.addToPanel = function (wildfire) {
        let clone = this._template.cloneNode(true);
        clone.classList.remove('hidden');
        clone.id = '';
        clone.dataset.id = wildfire.id;
        clone.querySelector('.panel-wildfire-id').textContent = wildfire.id;
        clone.addEventListener('click', (e) => {
            openDetailModal(wildfire, e.clientX, e.clientY);
        });
        clone.querySelector('.fly-to').addEventListener('click', (e) => {
            e.stopPropagation();
            Mapbox.getInstance().flyTo(wildfire.Coordinates[0].longitude, wildfire.Coordinates[0].latitude);
        });
        this._body.appendChild(clone);
    };

    WildfiresS.prototype.removeFromPanel = function (id) {
        let panelWildfire = this._panel.querySelector(`[data-id="${id}"]`);
        if (panelWildfire) {
            panelWildfire.remove();
        }
    }

    WildfiresS.prototype.clearPanel = function () {
        this._body.innerHTML = '';
    }

    WildfiresS.prototype.updateWildfires = function (updatedWildfires) {
        updatedWildfires.forEach(wildfire => {
            if (this._wildfires.find(w => w.id === wildfire.id)) {
                this._wildfires.find(w => w.id === wildfire.id).points = wildfire.points;
                this._geogson.features.find(w => w.properties.id === wildfire.id).geometry.coordinates = [wildfire.points];
            } else {
                this.add(wildfire);
            }
        });

        for (const wildfire in this._wildfires) {
            if (!updatedWildfires.find(w => w.id === wildfire.id)) {
                this.remove(wildfire.id);
            }
        }

        this.callDraw();
    }

    WildfiresS.prototype.buildPolygonCoordinates = function (coordinates) {
        const referencePoint = coordinates[0];

        coordinates.sort((a, b) => {
            const crossProduct = (p1, p2) => {
                return (p1.longitude - referencePoint.longitude) * (p2.latitude - referencePoint.latitude) -
                    (p2.longitude - referencePoint.longitude) * (p1.latitude - referencePoint.latitude);
            };

            return Math.atan2(crossProduct(a, b), a.latitude - referencePoint.latitude) - Math.atan2(crossProduct(b, a), b.latitude - referencePoint.latitude);
        });

        return [coordinates.map(c => [c.longitude, c.latitude])];
    };

    WildfiresS.prototype.callDraw = function () {
        const event = new CustomEvent('wildfires:updated', {detail: 'Wildfires updated'});
        document.dispatchEvent(event);
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
        this.coordinates = document.getElementById('coordinates');
        this.layersDrawn = false;
        this._onMapReady = () => {
        };

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

        this._map.on('mousemove', (e) => {
            const {lng, lat} = e.lngLat;
            this.coordinates.textContent = `lng: ${lng.toFixed(4)}, lat: ${lat.toFixed(4)}`;
        });

        this._map.on('load', async () => {
            await this.stylize();
            await this.draw();
            this._onMapReady(this);
        });
    };

    MapboxS.prototype.onMapReady = function (callback) {
        this._onMapReady = callback;
    };

    MapboxS.prototype.getMap = function () {
        return this._map;
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
            if (!this.layersDrawn) {
                await this.addWildfiresLayer();
                this.layersDrawn = true;
            }

            await this.drawBots();
            await this.drawWildfires();
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

    MapboxS.prototype.drawBots = function () {
        let botsGeojson = Bots.getInstance()._geogson;
        for (const bot of botsGeojson.features) {
            let botMarker = Bots.getInstance()._botsMarkers.find(marker => marker.id === bot.properties.id);
            if (botMarker) {
                botMarker.marker.setLngLat(bot.geometry.coordinates);
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

        for (const marker of Bots.getInstance()._botsMarkers) {
            if (!botsGeojson.features.find(bot => bot.properties.id === marker.id)) {
                marker.marker.remove();
                Bots.getInstance()._botsMarkers = Bots.getInstance()._botsMarkers.filter(bot => bot.id !== marker.id);
            }
        }
    }

    MapboxS.prototype.drawWildfires = function () {
        this._map.getSource('wildfires-source').setData(Wildfires.getInstance()._geogson);
    }

    MapboxS.prototype.flyTo = function (longitude, latitude, zoom = 14) {
        this._map.flyTo({
            center: [longitude, latitude],
            zoom: zoom,
            essential: true,
            speed: 2.5,
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

class Realtime {
    constructor(socket) {
        this._mapbox = Mapbox.getInstance();
        this.socket = socket;
        this._init();
    }

    _init() {
        const bots = Bots.getInstance();
        const wildfires = Wildfires.getInstance();

        document.getElementById('detail-modal-close').addEventListener('click', () => {
            document.getElementById('detail-modal').style.display = 'none';
        });

        this.socket.on('bots:update', (data) => {
            // console.log(`Bots - ${Date.now()}`, data);
            bots.updateBots(data);
        });

        this.socket.on('fires:update', (data) => {
            // console.log(`Wildfires - ${Date.now()}`, data);
            wildfires.updateWildfires(data);
        });

        this.socket.on('fire:end', (data) => {
            wildfires.remove(data);
        });

        this.socket.on('bot:unavailable', () => {
            ToastManager.error('No available bots, create some bots !');
        });

        this.socket.on('bot:assignment', (data) => {
            ToastManager.info(`Bot ${data.botId} assigned to wildfire ${data.fireId}, will arrive in ${data.duration} seconds`);
        });

        this._mapbox.onMapReady((mapbox) => {
            mapbox.draw();

            document.addEventListener('wildfires:updated', () => {
                mapbox.draw();
            });

            document.addEventListener('bots:updated', () => {
                mapbox.draw();
            });
        });
    }
}

new Realtime(socket);

