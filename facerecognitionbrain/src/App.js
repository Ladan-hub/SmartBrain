import React, { Component, useState } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import ParticlesBg from 'particles-bg'
import "./App.css";


// constructor(){
//   super();
//   this.state = {
//   input = ‘’,
//   }
  
//   onInputChange = (event) => {
//   console.log(event)
//   }
//   }
  
function App() {

  const [input, setInput] = useState('');

  const onInputChange = (event) => {
    console.log(event.target.value);
    setInput(event.target.value)
  }


  

  return (
    <div className="App">
      <ParticlesBg color="#ffffff" num={150}  type="cobweb" bg={true} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={onInputChange} />
      {/* <FaceRecognition /> */}
    </div>
  );
}

export default App;


// "interactivity": {
//   "events": {
//       "onhover": {
//           "enable": true,
//           "mode": "repulse"
//       }
//   }
// }
