import { useState, useEffect } from "react";
import "./App.css";
import { ArrowLeft } from 'lucide-react';

function App() {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [msg, setMsg] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLookup, setShowLookup] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const handleLookup = async () => {
    setError("");
    setData([]);
    setFiltered([]);

    if (pincode.length !== 6) {
      setError("Pincode must be exactly 6 digits.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const result = await res.json();

      if (result[0].Status !== "Success") {
        setError(result[0].Message);
        return;
      }

      setShowLookup(false);
      setShowResult(true);

      setData(result[0].PostOffice);
      setMsg(result[0].Message);
      setFiltered(result[0].PostOffice);
    }
    catch {
      setError("Failed to fetch pincode details.");
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      if (!filterText.trim()) {
        setFiltered(data);
        return;
      }

      const f = data.filter((item) =>
        item.Name.toLowerCase().includes(filterText.toLowerCase())
      );

      setFiltered(f);
    }, 400);

    return () => clearTimeout(delay);
  }, [filterText, data]);

  const handleBack = () => {
    setShowLookup(true);
    setShowResult(false);
    setFilterText("");
    setPincode("");
    setData([]);
    setFiltered([]);
    setMsg("");
    setError("");
  };

  return (
    <div className="container">
      {showLookup && (
        <>
          <h2>Pincode Lookup</h2>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit pincode"
            onWheel={(e) => e.target.blur()}
            value={pincode}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setPincode(e.target.value);
            }}
          />

          <button onClick={handleLookup}>Lookup</button>
        </>
      )}

      {loading && <div className="loader"></div>}

      {error && <p className="error">{error}</p>}


      {showResult && (
        <>
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={25} color="#000000" strokeWidth={3} />
          </button>
          
          <div>
            <h3>Pincode: {pincode}</h3>
            <h3>Message: {msg}</h3>
          </div>
        </>
      )}

      {showResult && data.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Filter by post office name"
            className="filter"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />

          {filtered.length === 0 && (
            <p className="error">
              Couldn’t find the postal data you’re looking for…
            </p>
          )}
        </>
      )}

      {showResult && (
        <div className="grid">
          {filtered.map((item, index) => (
            <div className="card" key={index}>
              <p><b>Name:</b> {item.Name}</p>
              <p><b>Branch Type:</b> {item.BranchType}</p>
              <p><b>Delivery Status:</b> {item.DeliveryStatus}</p>
              <p><b>District:</b> {item.District}</p>
              <p><b>Division:</b> {item.Division}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;