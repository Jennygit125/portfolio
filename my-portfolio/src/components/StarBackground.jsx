import { useEffect, useState } from "react";

const createStars = () => {
  const numberOfStars = Math.max(
    35,
    Math.floor((window.innerWidth * window.innerHeight) / 10000),
  );

  return Array.from({ length: numberOfStars }, (_, id) => ({
    id,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.45 + 0.45,
    animationDuration: Math.random() * 4 + 2,
  }));
};

const createMeteors = () =>
  Array.from({ length: 4 }, (_, id) => ({
    id,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 20,
    delay: id === 0 ? 0.2 : Math.random() * 5 + id * 1.5,
    animationDuration: Math.random() * 3 + 3,
  }));

export const StarBackground = () => {
  const [stars, setStars] = useState([]);
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const generateSky = () => {
      setStars(createStars());
      setMeteors(createMeteors());
    };

    generateSky();

    let resizeTimeout;
    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(generateSky, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-pulse-subtle"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            "--star-opacity": star.opacity,
            animationDuration: `${star.animationDuration}s`,
          }}
        />
      ))}

      {meteors.map((meteor) => (
        <div
          key={meteor.id}
          className="meteor animate-meteor"
          style={{
            width: `${meteor.size * 50}px`,
            height: `${meteor.size * 2.5}px`,
            left: `${meteor.x}%`,
            top: `${meteor.y}%`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.animationDuration}s`,
          }}
        />
      ))}
    </div>
  );
};
