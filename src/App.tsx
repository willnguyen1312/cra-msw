import React from "react";
import Fetch from "./Fetch";

function App() {
  return (
    <div>
      <Fetch url="/greeting" failed={false} />
      <Fetch url="/fail" failed={true} />
    </div>
  );
}

export default App;
