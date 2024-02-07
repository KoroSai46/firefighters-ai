class MapService {
    constructor() {
        this.apiKey = process.env.MAPBOX_API_KEY;
    }

    navigateToLocation(departure, arrival) {
        console.log('Navigating from ' + departure.latitude + ',' + departure.longitude + ' to ' + arrival.latitude + ',' + arrival.longitude);

        const baseUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving/';
        //add coordinates to the url
        const url = new URL(baseUrl + departure.longitude + ',' + departure.latitude + ';' + arrival.longitude + ',' + arrival.latitude);
        url.searchParams.append('access_token', this.apiKey);
        url.searchParams.append('overview', 'full');
        url.searchParams.append('geometries', 'geojson');
        url.searchParams.append('steps', 'true');
        url.searchParams.append('alternatives', 'false');
        url.searchParams.append('language', 'fr');
        url.searchParams.append('coordinates', departure.longitude + ',' + departure.latitude + ';' + arrival.longitude + ',' + arrival.latitude);

        return fetch(url)
            .then(response => response.json())
            .then(data => {
                return data;
            });

    }
}

module.exports = new MapService();