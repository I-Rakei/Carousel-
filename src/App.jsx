import React from "react";
import Carousel from "./components/Carousel.jsx";

const App = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <Carousel autoPlay={true} />
    </div>
  );
};

export default App;
