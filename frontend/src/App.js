import React, { useState } from "react";
import ParticlesBg from "particles-bg";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Rank from "./components/Rank/Rank";
import Register from "./components/Register/Register";
import "./App.css";

// we created a function that:
//1. stores important information like PAT, USER_ID, etc.
//2. receives the imageUrl from out user
//3. Sets up the JSON data that will send to Clarifai
//4. creates a request object
//5. returns the request object

const returnClarifaiJSONRequestOptions = (imageUrl) => {
  // Your PAT (Personal Access Token) can be found in the portal under Authentification
  const PAT = "e73aa64b7470451f97602095b550658c";
  // Specify the correct user_id/app_id pairings
  // Since you're making inferences outside your app's scope
  const USER_ID = "ladannazari";
  const APP_ID = "SmartBrain";
  // Change these to whatever model and image URL you want to use
  const MODEL_ID = "face-detection";
  const IMAGE_URL = imageUrl;

  // We're setting up the JSON that we will send to Clarifai
  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
  return requestOptions;
};

function App() {
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [box, setBox] = useState({});
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setIsSignedIn(false)
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
    setRoute(route);
  }

  const calculateFaceLocation = (data) => {
    // some calculation to find the location of the face
    const boundingBox =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    console.log(width);
    const height = Number(image.height);
    const boxLocation = {
      leftCol: boundingBox.left_col * width,
      topRow: boundingBox.top_row * height,
      rightCol: width - boundingBox.right_col * width,
      bottomRow: height - boundingBox.bottom_row * height,
    };
    return boxLocation;
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onButtonSubmit = () => {
    const requestOptions = returnClarifaiJSONRequestOptions(input);
    fetch(
      "https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error occurred while fetching data");
        }
        return response.json();
      })
      .then((data) => {
        // Process the response data here
        console.log(data);
        setImageUrl(input); // Set the imageUrl state after successful response
        const image = document.getElementById("inputImage");
      image.onload = () => {
        const boxLocation = calculateFaceLocation(data);
        displayFaceBox(boxLocation);
      };
        return calculateFaceLocation(data);
      })
      .then((boxLocation) => displayFaceBox(boxLocation))
      .catch((error) => {
        // Handle any errors that occurred during the fetch request
        console.error(error);
      });
  };

  return (
    <div className="App">
      <ParticlesBg color="#ffffff" num={150} type="cobweb" bg={true} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === 'signin' || route === 'signout'
        ? <Signin onRouteChange={onRouteChange} />
        : route === 'register' ? <Register onRouteChange={onRouteChange} />  : (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={onInputChange}
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        )
      }
      
    </div>
  );
    }
  

export default App;
