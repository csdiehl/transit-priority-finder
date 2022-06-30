import "./App.css";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import segmentData from "./Data/mbta_proposed_segments.json";
import { useState, useMemo } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [weights, setWeights] = useState({ w1: 1, w2: 1, w3: 1, w4: 1 });
  const [filter, setFilter] = useState(0);
  const [loading, setLoading] = useState(false);
  const variable = "total_score";

  function adjustFilters(newWeights, newFilterValue) {
    if (
      Object.values(newWeights).every(
        (w, idx) => w === Object.values(weights)[idx]
      ) === false
    ) {
      setWeights(newWeights);
    }

    if (newFilterValue !== filter) {
      setFilter(newFilterValue);
    }
  }

  function recalculateScore(weights, filter) {
    setLoading(true);
    const { w1, w2, w3, w4 } = weights;

    const newData = segmentData.features
      .map((d) => {
        const score1 = d.properties.freq_score * w1;
        const score2 = d.properties.time_variability * w2;
        const score3 = d.properties.demographics * w3;
        const score4 = d.properties.other_factors * w4;

        const weightedAvg = Math.round(
          (score1 + score2 + score3 + score4) / (w1 + w2 + w3 + w4)
        );

        return {
          type: d.type,
          properties: {
            ...d.properties,
            total_score: weightedAvg,
          },
          geometry: d.geometry,
        };
      })
      .filter((d) => d.properties.total_score >= filter);

    const values = newData.map((d) => d.properties.total_score);
    setLoading(false);

    return [newData, values];
  }

  //this is still re-computing every time even though it's wrapped in useMemo
  const [mapData, scoreValues] = useMemo(
    () => recalculateScore(weights, filter),
    [weights, filter]
  );

  return (
    <div className="App">
      {loading && <LoadingSpinner />}
      <Sidebar data={scoreValues} adjustFilters={adjustFilters} />
      <Map data={mapData} values={scoreValues} variable={variable} />
    </div>
  );
}

export default App;
