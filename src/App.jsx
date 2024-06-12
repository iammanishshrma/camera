import React from "react";
import Camera from "./Camera";

const App = () => {
  return (
    <>
      <input type="file" accept="image/*;capture=camera" multiple />
      <Camera />
    </>
  );
};

export default App;
