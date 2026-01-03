import Map from 'ol/Map.js';
import View from 'ol/View.js';
import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import MVT from 'ol/format/MVT.js';
import VectorTileLayer from 'ol/layer/VectorTile.js';
import VectorTileSource from 'ol/source/VectorTile.js';
import { fromLonLat } from 'ol/proj.js';
import { createS57StyleFunction } from './style.js';
import { getColor } from './colors.js';

/**
 * S57 OpenLayers Renderer
 * Based on Njord: https://github.com/manimaul/njord
 */

/**
 * Create an OpenLayers map with S57 styling
 * @param {Object} options - Configuration options
 * @param {string} options.target - DOM element ID for the map
 * @param {string} options.theme - Theme mode ('DAY', 'DUSK', or 'NIGHT')
 * @param {Array<number>} options.center - Map center [lon, lat]
 * @param {number} options.zoom - Initial zoom level
 * @param {string} options.tileUrl - MVT tile URL (e.g., from Njord server)
 * @returns {Map} OpenLayers map instance
 */
export function createS57Map(options = {}) {
  const {
    target = 'map',
    theme = 'DAY',
    center = [0, 0],
    zoom = 2,
    tileUrl = null
  } = options;

  const map = new Map({
    target: target,
    view: new View({
      center: fromLonLat(center),
      zoom: zoom
    })
  });

  // Set background color based on theme
  const backgroundColor = getColor('NODTA', theme);
  map.getTargetElement().style.backgroundColor = backgroundColor;

  // Add S57 vector tile layer if URL provided
  if (tileUrl) {
    const s57Layer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: tileUrl
      }),
      style: createS57StyleFunction(theme)
    });
    
    map.addLayer(s57Layer);
  }

  return map;
}

/**
 * Create a vector layer from GeoJSON with S57 styling
 * @param {Object} geojson - GeoJSON feature collection
 * @param {string} theme - Theme mode
 * @returns {VectorLayer} OpenLayers vector layer
 */
export function createS57VectorLayer(geojson, theme = 'DAY') {
  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geojson, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
  });

  return new VectorLayer({
    source: vectorSource,
    style: createS57StyleFunction(theme)
  });
}

/**
 * Change map theme
 * @param {Map} map - OpenLayers map instance
 * @param {string} newTheme - New theme mode ('DAY', 'DUSK', or 'NIGHT')
 */
export function changeTheme(map, newTheme) {
  // Update background color
  const backgroundColor = getColor('NODTA', newTheme);
  map.getTargetElement().style.backgroundColor = backgroundColor;
  
  // Update all layers with new theme
  const newStyleFunction = createS57StyleFunction(newTheme);
  map.getLayers().forEach(layer => {
    if (layer instanceof VectorLayer) {
      layer.setStyle(newStyleFunction);
    } else if (layer instanceof VectorTileLayer) {
      layer.setStyle(newStyleFunction);
    }
  });
  
  // Force re-render
  map.render();
}
