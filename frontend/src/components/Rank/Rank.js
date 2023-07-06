import React from "react";



const Rank = ({ name, entries }) => {
  console.log("this is the user's name", name)
  return (
    <div>
      <div className="white f3">
        {`Welcome ${name}`}
      </div>
      {/* <div className="white f1">{`#${entries}`}</div> */}
    </div>
  );
};

export default Rank;
