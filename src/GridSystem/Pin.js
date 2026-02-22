import React from "react";
import { Link } from "react-router-dom";

const styles = {
  pin: {
    margin: "15px 11px",
  },
  sm: {
    gridRowEnd: "span 22",
  },
  md: {
    gridRowEnd: "span 32",
  },
  lg: {
    gridRowEnd: "span 45",
  },
};

function Pin({ size, img, id, display }) {
  return (
    <div
      className={
        !display
          ? "transform transition duration-500"
          : " animate-pulse transform transition duration-500"
      }
      style={{ ...styles.pin, ...styles[size], cursor: "pointer" }}
    >
      {display && <div className="w-full h-full bg-gray-300"></div>}
      {!display && (
        <Link to={"/singlepage/" + id}>
          <img
            className="w-full h-full rounded-lg object-cover"
            src={img?.url}
            alt="img"
          />
        </Link>
      )}
    </div>
  );
}

export default Pin;
