import { useState, useEffect } from "react";
import axios from "axios";

const NASA_API_KEY = "d6527cabjdDfrQp6CZNOK1h8Sp3jC8XVfiESuqWx";
const NASA_API_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&count=5`;
const Carousel = ({ autoPlay = true }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interval, setIntervalState] = useState(5000);

  // Fetch images from NASA API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(NASA_API_URL);
        const imageData = response.data.map((item) => item.url);
        setImages(imageData);
      } catch (error) {
        console.error("Error fetching NASA images:", error);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const slideInterval = setInterval(() => {
      handleNext();
    }, interval);

    return () => clearInterval(slideInterval);
  }, [currentIndex, autoPlay, interval]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Handle change for interval input
  const handleIntervalChange = (e) => {
    const userInterval = parseInt(e.target.value);
    if (!isNaN(userInterval) && userInterval >= 1000) {
      setIntervalState(userInterval); // Update the interval with the user's input
    }
  };

  if (images.length === 0) {
    return <div className="text-white">Loading images...</div>;
  }

  return (
    <div className="relative w-screen h-screen">
      {/* Fullscreen Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={images[currentIndex]}
          alt={`NASA Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
        />
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
        onClick={handlePrev}
      >
        &#10094;
      </button>

      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
        onClick={handleNext}
      >
        &#10095;
      </button>

      {/* Dots for navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>

      {/* Input for interval */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/50 text-black px-4 py-2 rounded-lg">
        <label htmlFor="intervalInput" className="mr-2">
          Set Interval (ms):
        </label>
        <input
          type="number"
          id="intervalInput"
          className="px-2 py-1 border border-gray-400 rounded"
          min="1000"
          value={interval}
          onChange={handleIntervalChange}
        />
      </div>
    </div>
  );
};

export default Carousel;
