export default function Sidebar({
  counties,
  cities,
  selectedCounty,
  setSelectedCounty,
  selectedCity,
  setSelectedCity,
  resetMap,
}) {
  return (
    <div
      style={{
        width: "280px",
        padding: "20px",
        background: "#f8f9fa", // light background for contrast
        color: "#212529", // dark text for readability
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Instruction */}
      <p style={{ fontSize: "14px", marginBottom: "12px" }}>
        Display trails by selecting a county or city below.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "14px", fontWeight: "500" }}>
          Select by County:
        </label>
        <select
          value={selectedCounty}
          onChange={(e) => setSelectedCounty(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">-- Select County --</option>
          {counties.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={{ fontSize: "14px", fontWeight: "500" }}>
          Select by City:
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value="">-- Select City --</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={resetMap}
        style={{
          padding: "10px 14px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "500",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.background = "#0056b3")}
        onMouseLeave={(e) => (e.target.style.background = "#007bff")}
      >
        Reset Map
      </button>
    </div>
  );
}
