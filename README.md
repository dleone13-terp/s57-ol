# s57-ol

OpenLayers rendering for S57 data received from Njord/OpenENC

This library provides a simple OpenLayers renderer for S57 nautical chart data, using the exact color scheme and styling from [Njord](https://github.com/manimaul/njord).

## Features

- ✅ S57 color palette with DAY, DUSK, and NIGHT themes
- ✅ OpenLayers style functions for common S57 object classes
- ✅ Support for vector tiles (MVT format)
- ✅ Simple API for map creation and theme switching
- ✅ Based on Njord's styling conventions

## Installation

```bash
npm install
```

## Usage

### Basic Example

```javascript
import { createS57Map } from './src/index.js';

const map = createS57Map({
  target: 'map',
  theme: 'DAY',
  center: [-122.4, 37.8], // [longitude, latitude]
  zoom: 10
});
```

### With Njord Tile Server

```javascript
import { createS57Map } from './src/index.js';

const map = createS57Map({
  target: 'map',
  theme: 'DAY',
  center: [-122.4, 37.8],
  zoom: 10,
  tileUrl: 'http://localhost:9000/v1/tiles/{z}/{x}/{y}.pbf'
});
```

### Switching Themes

```javascript
import { changeTheme } from './src/index.js';

// Switch to night mode
changeTheme(map, 'NIGHT');
```

## Development

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## S57 Object Classes

The library includes styling for common S57 object classes:

- **LNDARE** - Land areas (fill and coastline)
- **DEPARE** - Depth areas (with depth-based colors)
- **DEPCNT** - Depth contours
- **COALNE** - Coastline
- **BUAARE** - Built-up areas
- **BCNLAT/BOYLAT** - Beacons and buoys
- **LIGHTS** - Navigation lights
- **SOUNDG** - Depth soundings

More object classes can be easily added following the same pattern.

## Color Themes

Three themes are available, matching Njord's color schemes:

- **DAY** - Standard daylight colors
- **DUSK** - Reduced brightness for low-light conditions
- **NIGHT** - Red-shifted colors for night vision preservation

## Reference

This implementation is based on [Njord](https://github.com/manimaul/njord) by manimaul, which provides a complete Marine Electronic Navigational Chart (ENC) server. The color definitions and styling conventions are taken directly from Njord to ensure consistency.

## License

Apache-2.0
