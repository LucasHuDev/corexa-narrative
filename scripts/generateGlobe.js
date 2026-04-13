import fs from 'fs';
import * as topojson from 'topojson-client';

const LAND_DOTS = 5000;
const MAX_ATTEMPTS = 250000;
const R = 1.2;
const GEOJSON_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/land-50m.json';

function pointInRing(point, ring) {
  const [px, py] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(point, polygon) {
  if (!pointInRing(point, polygon[0])) return false;
  for (let h = 1; h < polygon.length; h++) {
    const hole = polygon[h];
    // Only exclude small holes (real lakes/inlets); large rings are
    // often dataset artefacts in land-50m that erase valid land.
    if (hole.length < 50 && pointInRing(point, hole)) return false;
  }
  return true;
}

function pointInFeature(point, feature) {
  const geom = feature.geometry;
  if (geom.type === 'Polygon') return pointInPolygon(point, geom.coordinates);
  if (geom.type === 'MultiPolygon') return geom.coordinates.some(poly => pointInPolygon(point, poly));
  return false;
}

async function main() {
  console.log('Fetching TopoJSON...');
  const res = await fetch(GEOJSON_URL);
  const world = await res.json();
  const land = topojson.feature(world, world.objects.land);

  function isLand(lat, lng) {
    return land.features.some(f => pointInFeature([lng, lat], f));
  }

  console.log('Computing land dots...');
  const positions = [];
  let attempts = 0;
  while (positions.length < LAND_DOTS * 3 && attempts < MAX_ATTEMPTS) {
    attempts++;
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const lat = (Math.asin(u) * 180) / Math.PI;
    const lng = (theta * 180) / Math.PI - 180;
    if (isLand(lat, lng)) {
      const phi = ((90 - lat) * Math.PI) / 180;
      const lngRad = ((lng + 180) * Math.PI) / 180;
      positions.push(
        +(-R * Math.sin(phi) * Math.cos(lngRad)).toFixed(5),
        +( R * Math.cos(phi)).toFixed(5),
        +( R * Math.sin(phi) * Math.sin(lngRad)).toFixed(5)
      );
    }
  }

  console.log(`Generated ${positions.length / 3} points in ${attempts} attempts`);

  fs.writeFileSync('public/globe-positions.json', JSON.stringify(positions));
  const size = fs.statSync('public/globe-positions.json').size;
  console.log(`Saved to public/globe-positions.json (${(size / 1024).toFixed(1)} KB)`);
}

main().catch(console.error);
