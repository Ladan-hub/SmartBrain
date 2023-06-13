import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2  ">
        {imageUrl && (
          <img
            id="inputImage"
            src={imageUrl}
            alt=""
            width="500"
            height="auto"
          />
        )}
        <div
          className="bounding-box"
          style={{
            top: box.topRow,
            bottom: box.bottomRow,
            left: box.leftCol,
            right: box.rightCol,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
