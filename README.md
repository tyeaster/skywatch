# SKYWATCH_

A personal weather operations dashboard in a single HTML file. Dark "radar room" theme, mono/sans type pairing, teal accent. No build step, no frameworks beyond Leaflet, no API keys — every data source is a free public endpoint.

**Live site:** https://tyeaster.github.io/skywatch/

## Features

- **Map** — Leaflet map on CARTO dark tiles with:
  - Animated NEXRAD radar loop (play/pause, scrubbable timeline, frame timestamps)
  - IR satellite cloud overlay
  - Live NWS alert polygons, color-coded by severity (warning / watch / advisory), click for details
  - **Severe Risk** overlay — SPC Day 1 categorical outlook polygons shaded on the map (Marginal → High), so severe threat sits alongside radar and your location
  - ~50 city stations with switchable TEMP / WIND readouts
  - **Forecast model field** — a real numerical-weather-model layer (Open-Meteo's GFS / ECMWF-IFS / ICON blend) sampled on a grid across the current view and painted as a smooth colored field, with a variable picker, a forecast-time slider out to +72 h, and a legend. This is genuine model output, distinct from the statistical baseline on the storm pages. Variables:
    - Wind speed, wind gusts, precipitation, CAPE (storm energy), sea-level pressure, temperature
    - **Deep-layer wind shear (200–850 hPa)** — the classic green-to-red tropical shear map, computed as the vector difference between upper- and lower-level model winds (green = low shear, favorable for tropical storms; red = high shear, hostile)
  - Click anywhere (or **"Use my location"**) for a point forecast: current conditions, **air quality (US AQI + PM2.5)**, **sunrise/sunset and moon phase**, a 48-hour temperature sparkline (canvas), and a 7-day outlook
  - **Use my location** — one tap centers the map on where you are and sets it as your tracked favorite (browser geolocation)
  - **Favorite locations** — search any place by name (or use your location) and pin up to six. Each gets a sidebar card tracking its current conditions, today's hi/lo, and any active NWS warnings/advisories (color-coded, with a red glow when something is active). Saved in your browser (localStorage) so they persist across visits; "View on map" flies there and opens the full forecast.
- **Severe** — NOAA Storm Prediction Center convective outlooks: Day 1–3 categorical risk (Marginal → High), the Day 4–8 outlook, and Day 1 tornado / hail / damaging-wind probabilities, with a risk-level legend
- **Hurricanes** — a dedicated tropical-cyclone tracker: active storm cards from NHC plus the 7-day basin outlooks. **Tap any storm** for a full research briefing (deep-linkable via `#storm/<id>`):
  - **Spaghetti model guidance** — an interactive map plotting *every* forecast track in NHC's public ATCF guidance deck: the globals (GFS, ECMWF, UKMET, CMC, NAVGEM), the hurricane models (HWRF, HMON, HAFS-A/B, COAMPS-TC), the consensus aids (TVCN, HCCA, GEFS mean), the GEFS ensemble members, NHC's official track, the observed best track, and the cone. Each class toggles on/off; **tap any line** for that model's landfall intensity.
  - **Landfall outlook** — every guidance track is walked hour-by-hour against a coastline to find where it reaches land and what its forecast wind is at that moment. Produces a most-likely landfall **category**, the agreement count, median wind, likely area and timing window, a full category-distribution histogram, and a per-model landfall table.
  - **Intensity guidance** — all models' forecast wind vs. lead time on one chart with Saffir-Simpson bands (wide spread = low confidence), plus a guidance table of forecast wind by lead time colored by implied category.
  - **Official NHC forecast track & cone** — parsed from the NHC forecast advisory and drawn as the real forecast positions + 5-day cone of uncertainty.
  - Current intensity in kt / mph / km/h, min pressure, Saffir-Simpson category, and a ladder showing the wind needed for the next category
  - **SKYWATCH baseline forecasts** — a damped-persistence intensity forecast (+24/+48/+72 h) with NHC-error uncertainty bands on a wind/pressure history chart (with intensification rate + rapid-intensification flag), and a curved persistence + turn-rate track model (CLIPER-class)
  - Plain-language impact guidance, auto-collected links to the authoritative NHC products, and a **Model & Methodology** card
- **Fronts** — WPC surface analysis and day-1 forecast fronts, with a plain-language key to fronts, highs and lows

  **On model guidance:** the spaghetti tracks, intensity guidance and landfall analysis all come from NHC's own ATCF a-deck (and the b-deck for the observed track) — the same model output forecasters use — fetched directly, then through CORS proxies, with gzip decoded in-browser. If those files can't be reached, the tracker degrades to the official NHC advisory track alone and says so.

  **On the forecast model:** SKYWATCH's own track/intensity forecasts are a transparent *statistical baseline* (persistence + climatology), computed in-browser from the current snapshot plus locally-recorded history. It does not ingest numerical weather models, satellite, ocean heat, or wind shear, and it is expected to be beaten by the NHC's model consensus — every value is labeled *official NHC* vs. *SKYWATCH-computed*, and the app is explicit that the NHC forecast is authoritative for any safety decision.
- **Learn** — field notes on reading radar reflectivity, watches vs. warnings, tropical classifications, surface charts, and IR imagery
- **Installable (PWA)** — "Add to Home Screen" to run SKYWATCH fullscreen like a native app; a service worker caches the app shell so it loads instantly and shows its last state offline (live data always fetches fresh)
- The **Forecast Model** layer has a play button to animate the field through its forecast hours, like the radar loop
- Auto-refreshes all data every 5 minutes

## Data sources (all free, no keys)

| Source | Used for |
|---|---|
| [RainViewer](https://www.rainviewer.com/api.html) | Radar (NEXRAD-derived) and IR satellite tiles + frame timeline |
| [NWS API](https://www.weather.gov/documentation/services-web-api) (api.weather.gov) | Active alert polygons |
| [Open-Meteo](https://open-meteo.com/) | Station observations (batch), point forecasts, and place-name search (geocoding API) |
| [NWS API](https://www.weather.gov/documentation/services-web-api) point alerts | Active warnings/advisories for the favorite location (US only) |
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
