import React, { useState, useRef } from 'react';
import './cam.css';

const MobileCamera = () => {
  const videoRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleStartCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use the back camera
          width: { ideal: 4096 }, // Excellent camera quality width
          height: { ideal: 2160 }, // Excellent camera quality height
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(track => track.stop());
    }

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

    // Convert the canvas image to a data URL
    const dataUrl = canvas.toDataURL('image/png');

    // Create a link element to download the image
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `captured_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="mobile-camera-container">
      <div className="camera-controls">
        {isCameraActive ? (
          <>
            <button onClick={handleStopCamera}>Stop Camera</button>
            <button onClick={handleCaptureImage}>Capture Image</button>
          </>
        ) : (
          <button onClick={handleStartCamera}>Start Camera</button>
        )}
      </div>
      <div className="video-container">
        {isCameraActive && <video ref={videoRef} autoPlay muted playsInline />}
      </div>
    </div>
  );
};

export default MobileCamera;
