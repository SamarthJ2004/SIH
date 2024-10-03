import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, Rectangle, useMapEvent, useMap, Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "../styles/mapComponent.css";
import data1 from '../locationData/testMax.json';
import data2 from '../locationData/samjson.json';
import { colors, POSITION_CLASSES } from './mapUI.js';
import Loading from './Loading.js';
import { useNavigate } from 'react-router-dom';

const createArrowIcon = (color, rotation, size = 60) => {
  return L.divIcon({
    className: 'arrow-icon',
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg);">
        <polygon points="30,0 45,22.5 30,15 15,22.5" fill="${color}" /> <!-- Arrowhead -->
      </svg>`,
    iconSize: [size, size], // Use the provided size for icon size
    iconAnchor: [size / 2, size], // Adjust the anchor point based on size
    popupAnchor: [0, -34],
  });
};

L.Marker.prototype.options.icon = L.icon({
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  iconSize: [25, 41],
  shadowSize: [41, 41]
});

const SetViewOnClick = ({ animateRef }) => {
  const map = useMapEvent('click', (e) => {
    if (animateRef.current) {
      map.setView(e.latlng, 8, { animate: true });
    }
  });
  return null;
};

const BOUNDS_STYLE = { weight: 1 };

function MinimapBounds({ parentMap, zoom }) {
  const minimap = useMap();
  const onClick = useCallback(
    (e) => {
      parentMap.setView(e.latlng, parentMap.getZoom());
    },
    [parentMap],
  );

  useMapEvent('click', onClick);

  const [bounds, setBounds] = useState(parentMap.getBounds());

  useEffect(() => {
    const onChange = () => {
      setBounds(parentMap.getBounds());
      minimap.setView(parentMap.getCenter(), zoom);
    };

    parentMap.on('move', onChange);
    parentMap.on('zoom', onChange);

    return () => {
      parentMap.off('move', onChange);
      parentMap.off('zoom', onChange);
    };
  }, [minimap, parentMap, zoom]);

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />;
}

function MinimapControl({ position, zoom }) {
  const parentMap = useMap();
  const mapZoom = zoom || 0;

  const minimap = useMemo(
    () => (
      <MapContainer
        style={{ height: 80, width: 80 }}
        center={parentMap.getCenter()}
        zoom={mapZoom}
        dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        attributionControl={false}
        zoomControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MinimapBounds parentMap={parentMap} zoom={mapZoom} />
      </MapContainer>
    ),
    [parentMap, mapZoom],
  );

  const positionClass = (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;

  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">{minimap}</div>
    </div>
  );
}

const MapComponent = () => {
  const [mapTime, setMapTime] = useState("real time map");
  const [selectedRadio, setSelectedRadio] = useState("raw");
  const animateRef = useRef(false);
  const [pos, setPos] = useState([]);
  const [hoveredMarkerIndex, setHoveredMarkerIndex] = useState(null);
  const [data, setData] = useState(data1);
  const [loading, setLoading] = useState(false);
  const [imageShow, setImageShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setData(mapTime === "real time map" ? data1 : data2);
  }, [mapTime]);

  useEffect(() => {
    setPos(new Array(data.length).fill(0));
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((prevPos) =>
        prevPos.map((position, index) =>
          position < data[index].COORDS.length - 1 ? position + 1 : position
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    const targetShip = data.find(ship => ship.MMSI === 477593700);
    if (targetShip && (pos[data.indexOf(targetShip)] === 11 || pos[data.indexOf(targetShip)] === 12)) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
        setImageShow(true);
      }
    } else {
      setLoading(false);
    }
  }, [data, pos]);

  const handleMapChange = (e) => {
    setMapTime(e.target.value);
    setSelectedRadio("raw");
  };

  const handleRadioChange = (value) => {
    setSelectedRadio(value);
    setMapTime(value === "raw" ? "real time map" : "old map");
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div className="loading-overlay">
          <Loading stroke="#fff" />
          <p>Fetching satellite images...</p>
        </div>
      )}

      {
        imageShow && navigate('/image')
      }

      <MapContainer center={[27, -95]} zoom={7} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* <Marker position={[27, -95]}>
          <Tooltip direction='bottom' permanent>Gulf of Mexico</Tooltip>
        </Marker> */}
        <SetViewOnClick animateRef={animateRef} />
        <MinimapControl position="topright" />

        {data.map((ship, index) => {
          const coord = ship.COORDS[pos[index]] || [];
          const isTargetShip = ship.MMSI === 477593700;
          const shouldTurnRed = isTargetShip;

          // Calculate the rotation based on the previous and current coordinates
          const previousCoord = ship.COORDS[pos[index] - 1] || coord;
          const angle = previousCoord.length === 2 ? Math.atan2(coord[0] - previousCoord[0], coord[1] - previousCoord[1]) * (180 / Math.PI) : 0;
          const arrowColor = shouldTurnRed ? 'red' : 'blue';
          const arrowIcon = createArrowIcon(arrowColor, angle);

          if (coord.length < 2) {
            console.warn(`Invalid coordinate at index ${index}:`, coord);
            return null;
          }

          return (
            <React.Fragment key={index}>
              <Marker
                position={coord}
                icon={arrowIcon}
                eventHandlers={{
                  mouseover: () => setHoveredMarkerIndex(index),
                  mouseout: () => setHoveredMarkerIndex(null),
                }}
              >
                <Popup>
                  Ship MMSI Id : {ship.MMSI}<br />
                  Latitude : {coord[0]}<br />
                  Longitude : {coord[1]}
                </Popup>
                {isTargetShip && (
                  <Tooltip direction="right" permanent>
                    Alert: A possible oil spill.
                  </Tooltip>
                )}
              </Marker>
              {hoveredMarkerIndex === index && ship.COORDS.length > 1 && (
                <Polyline
                  positions={ship.COORDS.filter((loc, i) => i <= pos[index])}
                  color={colors[index % 20]}
                  weight={2}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      <select
        onChange={handleMapChange}
        value={mapTime}
        className='selectLocation'>
        <option value="real time map">Real Time Map</option>
        <option value="old map">Old Map</option>
      </select>
      <div className="radio-container">
        <label>
          <input type="radio" value="raw" checked={selectedRadio === "raw"} onChange={() => handleRadioChange("raw")} />
          Raw AIS Data
        </label>
        <label>
          <input type="radio" value="processed" checked={selectedRadio === "processed"} onChange={() => handleRadioChange("processed")} />
          Processed AIS Data
        </label>
      </div>
    </div>
  );
};

export default MapComponent;
