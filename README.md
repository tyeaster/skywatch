# SKYWATCH_

A personal weather operations dashboard in a single HTML file. Dark "radar room" theme, mono/sans type pairing, teal accent. No build step, no frameworks beyond Leaflet, no API keys — every data source is a free public endpoint.

**Live site:** https://tyeaster.github.io/skywatch/

## Features

- **Map** — Leaflet map on CARTO dark tiles with:
  - Animated NEXRAD radar loop (play/pause, scrubbable timeline, frame timestamps)
  - IR satellite cloud overlay
  - Live NWS alert polygons, color-coded by severity (warning / watch / advisory), click for details
  - ~50 city stations with switchable TEMP / WIND readouts
  - Click anywhere for a point forecast: current conditions, 48-hour temperature sparkline (canvas), and 7-day outlook
- **Tropics + Fronts** — active tropical cyclone cards from NHC, plus live NHC 7-day tropical outlooks and WPC surface-analysis / forecast-fronts charts
- **Learn** — field notes on reading radar reflectivity, watches vs. warnings, tropical classifications, surface charts, and IR imagery
- Auto-refreshes all data every 5 minutes

## Data sources (all free, no keys)

| Source | Used for |
|---|---|
| [RainViewer](https://www.rainviewer.com/api.html) | Radar (NEXRAD-derived) and IR satellite tiles + frame timeline |
| [NWS API](https://www.weather.gov/documentation/services-web-api) (api.weather.gov) | Active alert polygons |
| [Open-Meteo](https://open-meteo.com/) | Station observations (batch) and point forecasts |
| [NHC](https://www.nhc.noaa.gov/) | `CurrentStorms.json` active-storm feed, tropical outlook charts |
| [WPC](https://www.wpc.ncep.noaa.gov/) | Surface analysis and forecast fronts charts |
| [OpenStreetMap](https://www.openstreetmap.org/) / [CARTO](https://carto.com/) | Dark basemap tiles |

### Known quirk: NHC CORS

NHC serves `CurrentStorms.json` without CORS headers, so a direct browser fetch normally fails. The Tropics page tries the direct fetch first, then a free key-less CORS mirror ([allorigins.win](https://allorigins.win/)), and if both fail it degrades to a friendly message — the outlook chart images (which aren't subject to CORS) stay live either way.

## Running locally

It's one file — open `index.html` in a browser, or serve it:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

## Deployment

Pushes to `main` deploy automatically to GitHub Pages via `.github/workflows/deploy-pages.yml` (static upload, no build).

## Credits

Map data © OpenStreetMap contributors, tiles by CARTO. Weather data courtesy of NOAA/NWS, NHC, WPC, RainViewer, and Open-Meteo.
