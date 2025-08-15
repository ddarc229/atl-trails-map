import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import Sidebar from "./Sidebar";

export default function App() {
  const mapRef = useRef(null);

  const [countiesData, setCountiesData] = useState(null);
  const [citiesData, setCitiesData] = useState(null);
  const [trailsData, setTrailsData] = useState(null);

  const [countiesList, setCountiesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTrailLayer, setSelectedTrailLayer] = useState(null);

  // Load GeoJSON data
  useEffect(() => {
    // Counties
    fetch(`${import.meta.env.BASE_URL}data/counties.geojson`)
      .then((r) => r.json())
      .then((data) => {
        setCountiesData(data);
        const countyNames = [
          ...new Set(data.features.map((f) => f.properties?.NAME20)),
        ].sort();
        setCountiesList(countyNames);
      })
      .catch((e) => console.error("Failed to load counties.geojson", e));

    // Cities
    fetch(`${import.meta.env.BASE_URL}data/cities.geojson`)
      .then((r) => r.json())
      .then((data) => {
        setCitiesData(data);
        const cityNames = [
          ...new Set(data.features.map((f) => f.properties?.Name)),
        ].sort();
        setCitiesList(cityNames);
      })
      .catch((e) => console.error("Failed to load cities.geojson", e));

    // Trails
    fetch(`${import.meta.env.BASE_URL}data/trails.geojson`)
      .then((r) => r.json())
      .then((data) => setTrailsData(data))
      .catch((e) => console.error("Failed to load trails.geojson", e));
  }, []);

  // Reset selected trail when filter changes
  useEffect(() => {
    setSelectedTrailLayer(null);
  }, [selectedCounty, selectedCity]);

  // Zoom to selected county
  useEffect(() => {
    if (!selectedCounty || !countiesData || !mapRef.current) return;
    const feature = countiesData.features.find(
      (f) => f.properties?.NAME20 === selectedCounty
    );
    if (feature)
      mapRef.current.fitBounds(L.geoJSON(feature).getBounds(), {
        padding: [20, 20],
      });
  }, [selectedCounty, countiesData]);

  // Zoom to selected city
  useEffect(() => {
    if (!selectedCity || !citiesData || !mapRef.current) return;
    const feature = citiesData.features.find(
      (f) => f.properties?.Name === selectedCity
    );
    if (feature)
      mapRef.current.fitBounds(L.geoJSON(feature).getBounds(), {
        padding: [20, 20],
      });
  }, [selectedCity, citiesData]);

  // Styles
  const countyStyle = () => ({ color: "#222", weight: 2, fill: false });
  const onEachCounty = (feature, layer) => {
    layer.bindTooltip(feature.properties?.NAME20 || "County");
    layer.on("click", () => setSelectedCounty(feature.properties?.NAME20));
  };

  const cityStyle = (feature) => ({
    color: "#007bff",
    weight: 2,
    fill:
      feature.properties?.Name === selectedCity ? "rgba(0,123,255,0.2)" : false,
  });
  const onEachCity = (feature, layer) => {
    layer.bindTooltip(feature.properties?.Name || "City");
    layer.on("click", () => setSelectedCity(feature.properties?.Name));
  };

  const trailBaseColor = "#EE575D";
  const trailClickColor = "#993940";
  const trailStyle = (feature) => {
    if (
      selectedTrailLayer?.feature?.properties?.OBJECTID ===
      feature.properties?.OBJECTID
    ) {
      return { color: trailClickColor, weight: 6, opacity: 0.8 };
    }
    return { color: trailBaseColor, weight: 4, opacity: 0.8 };
  };

  const createTrailPopup = (feature) => {
    const name = feature.properties?.Name || "Unknown";
    const type = feature.properties?.Project_Type || "Unknown";
    const plan = feature.properties?.Plan_ || "N/A";
    const length = feature.properties?.Length?.toFixed(2) || "N/A";

    return `
      <div style="font-size:14px;">
        <strong>Name:</strong> ${name}<br/>
        <strong>Project Type:</strong> ${type}<br/>
        <strong>Plan:</strong> ${plan}<br/>
        <strong>Length:</strong> ${length} miles
      </div>
    `;
  };

  // Filter trails based on selected county/city using bounds intersection
  const filteredTrails =
    trailsData && mapRef.current
      ? trailsData.features.filter((trail) => {
          let show = false;

          if (selectedCounty && countiesData) {
            const countyFeature = countiesData.features.find(
              (f) => f.properties?.NAME20 === selectedCounty
            );
            if (countyFeature) {
              const countyBounds = L.geoJSON(countyFeature).getBounds();
              const trailBounds = L.geoJSON(trail).getBounds();
              if (countyBounds.intersects(trailBounds)) show = true;
            }
          }

          if (!show && selectedCity && citiesData) {
            const cityFeature = citiesData.features.find(
              (f) => f.properties?.Name === selectedCity
            );
            if (cityFeature) {
              const cityBounds = L.geoJSON(cityFeature).getBounds();
              const trailBounds = L.geoJSON(trail).getBounds();
              if (cityBounds.intersects(trailBounds)) show = true;
            }
          }

          return show;
        })
      : [];

  // Reset map function
  const resetMap = () => {
    setSelectedCounty("");
    setSelectedCity("");
    setSelectedTrailLayer(null);
    if (mapRef.current) mapRef.current.setView([33.75, -84.39], 9);
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          padding: "16px 24px",
          background: "#343a40",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}arc-logo-trails-map.webp`}
          alt="Logo"
          style={{ maxWidth: "120px", height: "auto" }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: "20px" }}>Metro Atlanta Trails</h1>
          <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
            Explore the regional trail network by county and city.
          </p>
        </div>
      </header>

      <div style={{ flex: 1, display: "flex" }}>
        <Sidebar
          counties={countiesList}
          cities={citiesList}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          resetMap={resetMap}
        />

        <div style={{ flex: 1 }}>
          <MapContainer
            ref={mapRef}
            center={[33.75, -84.39]}
            zoom={9}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {countiesData && (
              <GeoJSON
                data={countiesData}
                style={countyStyle}
                onEachFeature={onEachCounty}
              />
            )}
            {citiesData && (
              <GeoJSON
                data={citiesData}
                style={cityStyle}
                onEachFeature={onEachCity}
              />
            )}

            {filteredTrails.map((feature) => (
              <GeoJSON
                key={feature.properties?.OBJECTID}
                data={feature}
                style={() => trailStyle(feature)}
                onEachFeature={(feature, layer) => {
                  layer.bindPopup(createTrailPopup(feature));
                  layer.on("click", () => {
                    setSelectedTrailLayer(layer);
                    const bounds = L.geoJSON(feature).getBounds();
                    mapRef.current.fitBounds(bounds, { padding: [50, 50] });
                    layer.openPopup();
                  });
                  layer.on("popupclose", () => setSelectedTrailLayer(null));
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
