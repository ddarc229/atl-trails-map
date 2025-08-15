export default function Sidebar({
  counties,
  cities,
  selectedCounty,
  setSelectedCounty,
  selectedCity,
  setSelectedCity,
}) {
  return (
    <div
      style={{
        width: "260px",
        padding: "20px",
        background: "#f8f9fa",
        color: "#000",
        overflowY: "auto",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontSize: "16px", marginBottom: "12px" }}>Filters</h2>

      {/* County */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold" }}>County:</label>
        <select
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
          style={{ width: "100%", padding: "6px", marginTop: "4px" }}
        >
          <option value="">All Counties</option>
          {counties.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label style={{ fontWeight: "bold" }}>City:</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{ width: "100%", padding: "6px", marginTop: "4px" }}
        >
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
