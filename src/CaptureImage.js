import React, { useState, useRef, useEffect } from 'react';
import './cam.css';

const CapturePic = () => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);

  useEffect(() => {
    const getAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
      } catch (error) {
        console.error('Error accessing video devices:', error);
      }
    };

    getAvailableCameras();
  }, []);

  const getCameraStream = async (deviceId) => {
    try {
      const constraints = { video: { deviceId: { exact: deviceId } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const handleStartCamera = () => {
    if (availableCameras.length > 0) {
      const backCamera = availableCameras.find(device => device.label.toLowerCase().includes('back'));
      const cameraToUse = backCamera || availableCameras[0];
      setSelectedCamera(cameraToUse.deviceId);
      getCameraStream(cameraToUse.deviceId);
    } else {
      console.error('No video input devices found');
    }
  };

  const handleStopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(track => track.stop());

    videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const handleCaptureImage = () => {
    const canvas = document.createElement('canvas');
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // Generate a custom name for the image
    const timestamp = Date.now();
    const name = imageName || `captured_${timestamp}.png`;

    // Convert the canvas image to a data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Set the captured image in the state
    setCapturedImage(dataUrl);

    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = name;
    link.click();

    // Clear the input field
    setImageName('');
  };

  return (
    <div className="capture-pic-container">
      <div className="camera-controls">
        {isCameraActive ? (
          <button onClick={handleStopCamera}>Stop Camera</button>
        ) : (
          <button onClick={handleStartCamera}>Start Camera</button>
        )}
      </div>
      <div className="video-container">
        <video ref={videoRef} autoPlay muted playsInline />
      </div>
      {isCameraActive && (
        <div className="capture-controls">
          <button onClick={handleCaptureImage}>Capture Image</button>
        </div>
      )}
      {capturedImage && (
        <div className="captured-image-container">
          <img src={capturedImage} alt="Captured" className="captured-image" />
        </div>
      )}
    </div>
  );
};

export default CapturePic;




