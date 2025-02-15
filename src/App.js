import React, { useEffect, useState } from "react";
import { fetchData } from "./services/api";

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
    };
    getData();
  }, []);

  return (
    <div>
      <h1>API Pong Response:</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Carregando...</p>}
    </div>
  );
}

export default App;
