import logo from "./logo.svg";
import React, { useState } from "react";
import "./App.css";
import QCform from "./QC_Form";
import ISPForm from "./ISP_QC_Form";
import Camera from "./CaptureImage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./HomeScreen";
import NewCamera from "./Camera";

function App() {
  // Try for Push on Git
  const [showComponent1, setShowComponent1] = useState(false);
  const [showComponent2, setShowComponent2] = useState(false);
  const [showComponent3, setShowComponent3] = useState(false);

  const handleButtonClick = (component) => {
    if (component === "QCform") {
      setShowComponent1(true);
      setShowComponent2(false);
      setShowComponent3(false);
    } else if (component === "ISPForm") {
      setShowComponent2(true);
      setShowComponent1(false);
      setShowComponent3(false);
    } else if (component === "NewCamera") {
      setShowComponent3(true);
      setShowComponent1(false);
      setShowComponent2(false);
    }
  };

  return (
    <div className="container">
      <div className="button-container">
        <button onClick={() => handleButtonClick("QCform")}>OSP Form</button>
        &nbsp; &nbsp;&nbsp;
        <button onClick={() => handleButtonClick("ISPForm")}>ISP Form</button>
        &nbsp; &nbsp;&nbsp;
        <button onClick={() => handleButtonClick("NewCamera")}>Camera</button>
      </div>

      {showComponent1 && <QCform />}
      {showComponent2 && <ISPForm />}
      {showComponent3 && <NewCamera />}
    </div>
    // // <div className="App">
    //    <BrowserRouter>
    //    <Routes>
    //    <Route index path="/" element={<QCform />}/>
    //     <Route path="/ispform" element={<ISPForm />}/>
    //     {/* <Route path="/ispform" element={<ISPForm />}>
    //     </Route> */}
    //    </Routes>
    //    </BrowserRouter>
    // //  {/* <QCform/> */}

    // // </div>
  );
}

export default App;
