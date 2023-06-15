import React from "react";

const Navigation = ({ onRouteChange, isSignedIn }) => {
  return (
    <div>
      {isSignedIn ? (
        <nav style={{ display: "flex", justifyContent: "flex-end" }}>
          <p
            style={{ textDecoration: "none" }}
            onClick={() => onRouteChange("signout")}
            className="f3 link dim black underline pa3 pointer"
          >
            Sign Out
          </p>
        </nav>
      ) : (
        <div>
          <nav style={{ display: "flex", justifyContent: "flex-end" }}>
            <p
              style={{ textDecoration: "none" }}
              onClick={() => onRouteChange("signin")}
              className="f3 link dim black underline pa3 pointer"
            >
              Sign In
            </p>
            <p
              style={{ textDecoration: "none" }}
              onClick={() => onRouteChange("register")}
              className="f3 link dim black underline pa3 pointer"
            >
              Register
            </p>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navigation;
