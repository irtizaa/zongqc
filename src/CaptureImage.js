import React, { useState, useRef, useEffect } from 'react';
import './cam.css';

const CapturePic = () => {
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [zoomValue, setZoomValue] = useState(1);

  useEffect(() => {
    const getAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const backCamera = videoDevices.find(device => device.label.toLowerCase().includes('back'));
        if (backCamera) {
          setSelectedCamera(backCamera.deviceId);
          setAvailableCameras([backCamera]);
        } else {
          console.error('No back camera found');
        }
      } catch (error) {
        console.error('Error accessing video devices:', error);
      }
    };

    getAvailableCameras();
  }, []);

  const getCameraStream = async (deviceId) => {
    try {
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          facingMode: 'environment', // Use the back camera
          width: { ideal: 4096 }, // Excellent camera quality width
          height: { ideal: 2160 }, // Excellent camera quality height
          advanced: [{ zoom: zoomValue }], // Apply initial zoom value
        },
      };
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
      if (backCamera) {
        setSelectedCamera(backCamera.deviceId);
        getCameraStream(backCamera.deviceId);
      } else {
        console.error('No back camera found');
      }
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

  const handleZoomIn = () => {
    setZoomValue(prevZoomValue => Math.min(prevZoomValue + 0.1, 10)); // Set the maximum zoom level (you can adjust this value)
  };

  const handleZoomOut = () => {
    setZoomValue(prevZoomValue => Math.max(prevZoomValue - 0.1, 1)); // Set the minimum zoom level (you can adjust this value)
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const videoTrack = stream.getVideoTracks()[0];
      const constraints = { advanced: [{ zoom: zoomValue }] };

      videoTrack.applyConstraints(constraints).catch(error => console.error('Error applying zoom:', error));
    }
  }, [isCameraActive, zoomValue]);

  return (
    <div className="capture-pic-container">
      <div className="camera-controls">
        {isCameraActive ? (
          <>
            <button onClick={handleStopCamera}>Stop Camera</button>
            <button onClick={handleZoomIn}>Zoom In</button>
            <button onClick={handleZoomOut}>Zoom Out</button>
          </>
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
