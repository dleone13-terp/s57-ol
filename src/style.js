import { Fill, Stroke, Style, Circle, Text } from 'ol/style.js';
import { getColor } from './colors.js';

/**
 * S57 Style Generator for OpenLayers
 * Based on Njord styling: https://github.com/manimaul/njord
 */

/**
 * Create a style function for S57 features
 * @param {string} theme - Theme mode ('DAY', 'DUSK', or 'NIGHT')
 * @returns {Function} OpenLayers style function
 */
export function createS57StyleFunction(theme = 'DAY') {
  return function(feature) {
    const geometry = feature.getGeometry();
    if (!geometry) {
      return [];
    }
    const geometryType = geometry.getType();
    const properties = feature.getProperties();
    const objectClass = properties.OBJL || properties.layer || 'UNKNOWN';
    
    // Get styles based on S57 object class
    return getStyleForObject(objectClass, geometryType, theme, properties);
  };
}

/**
 * Get OpenLayers style for a specific S57 object
 * @param {string} objectClass - S57 object class (e.g., 'LNDARE', 'DEPCNT')
 * @param {string} geometryType - OpenLayers geometry type
 * @param {string} theme - Theme mode
 * @param {Object} properties - Feature properties
 * @returns {Array<Style>} Array of OpenLayers styles
 */
function getStyleForObject(objectClass, geometryType, theme, properties) {
  const styles = [];
  
  // Common S57 object classes with Njord-style rendering
  switch (objectClass) {
    case 'LNDARE': // Land area
      if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
        styles.push(new Style({
          fill: new Fill({
            color: getColor('LANDA', theme)
          }),
          stroke: new Stroke({
            color: getColor('CSTLN', theme),
            width: 2
          })
        }));
      }
      break;
      
    case 'DEPARE': // Depth area
      if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
        const depthColor = getDepthColor(properties.DRVAL1, theme);
        styles.push(new Style({
          fill: new Fill({
            color: depthColor
          })
        }));
      }
      break;
      
    case 'DEPCNT': // Depth contour
      if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
        styles.push(new Style({
          stroke: new Stroke({
            color: getColor('DEPCN', theme),
            width: 1
          })
        }));
      }
      break;
      
    case 'COALNE': // Coastline
      if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
        styles.push(new Style({
          stroke: new Stroke({
            color: getColor('CSTLN', theme),
            width: 2
          })
        }));
      }
      break;
      
    case 'BUAARE': // Built-up area
      if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
        styles.push(new Style({
          fill: new Fill({
            color: getColor('LANDF', theme)
          }),
          stroke: new Stroke({
            color: getColor('CSTLN', theme),
            width: 1
          })
        }));
      }
      break;
      
    case 'BCNLAT': // Beacon lateral
    case 'BOYLAT': // Buoy lateral
      if (geometryType === 'Point' || geometryType === 'MultiPoint') {
        styles.push(new Style({
          image: new Circle({
            radius: 5,
            fill: new Fill({
              color: getColor('CHRED', theme)
            }),
            stroke: new Stroke({
              color: getColor('CHBLK', theme),
              width: 1
            })
          })
        }));
      }
      break;
      
    case 'LIGHTS': // Light
      if (geometryType === 'Point' || geometryType === 'MultiPoint') {
        styles.push(new Style({
          image: new Circle({
            radius: 6,
            fill: new Fill({
              color: getColor('LITYW', theme)
            }),
            stroke: new Stroke({
              color: getColor('CHBLK', theme),
              width: 2
            })
          })
        }));
      }
      break;
      
    case 'SOUNDG': // Sounding
      if (geometryType === 'Point' || geometryType === 'MultiPoint') {
        const depth = properties.DEPTH;
        if (depth !== undefined && depth !== null) {
          styles.push(new Style({
            text: new Text({
              text: String(depth),
              font: '10px sans-serif',
              fill: new Fill({
                color: getColor('SNDG2', theme)
              })
            })
          }));
        }
      }
      break;
      
    default:
      // Default styling for unknown objects
      styles.push(getDefaultStyle(geometryType, theme));
  }
  
  return styles.length > 0 ? styles : [getDefaultStyle(geometryType, theme)];
}

/**
 * Get depth-based color
 * @param {number} depth - Depth value in meters
 * @param {string} theme - Theme mode
 * @returns {string} Color for the depth
 */
function getDepthColor(depth, theme) {
  if (depth === undefined || depth === null) {
    return getColor('DEPDW', theme);
  }
  
  // Depth color ranges following Njord convention
  if (depth >= 30) {
    return getColor('DEPDW', theme); // Deep water
  } else if (depth >= 10) {
    return getColor('DEPMD', theme); // Medium depth
  } else if (depth >= 5) {
    return getColor('DEPMS', theme); // Medium shallow
  } else if (depth >= 2) {
    return getColor('DEPVS', theme); // Very shallow
  } else {
    return getColor('DEPIT', theme); // Depth in danger
  }
}

/**
 * Get default style for unknown objects
 * @param {string} geometryType - OpenLayers geometry type
 * @param {string} theme - Theme mode
 * @returns {Style} Default OpenLayers style
 */
function getDefaultStyle(geometryType, theme) {
  if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {
    return new Style({
      fill: new Fill({
        color: getColor('NODTA', theme)
      }),
      stroke: new Stroke({
        color: getColor('CHGRD', theme),
        width: 1
      })
    });
  } else if (geometryType === 'LineString' || geometryType === 'MultiLineString') {
    return new Style({
      stroke: new Stroke({
        color: getColor('CHGRD', theme),
        width: 1
      })
    });
  } else if (geometryType === 'Point' || geometryType === 'MultiPoint') {
    return new Style({
      image: new Circle({
        radius: 4,
        fill: new Fill({
          color: getColor('CHGRD', theme)
        }),
        stroke: new Stroke({
          color: getColor('CHBLK', theme),
          width: 1
        })
      })
    });
  }
  
  return new Style({});
}
