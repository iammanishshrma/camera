import React, { useRef, useState, useEffect, Fragment } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [photos, setPhotos] = useState(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const requestCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user", // Use 'environment' for the back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setHasPermission(true);
      } else {
        throw new Error("Video tag reference not found");
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      setErrorMessage(
        "Error accessing camera. Please ensure you have given permission and are using HTTPS."
      );
    }
  };
  useEffect(() => {
    requestCameraAccess();
  }, []);

  const takePhoto = () => {
    if (videoRef.current) {
      const width = videoRef.current.videoWidth;
      const height = videoRef.current.videoHeight;
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/png");
      setPhotos((prev) => {
        if (prev) {
          return [...prev, dataUrl];
        } else {
          return [dataUrl];
        }
      });
    }
  };

  const removePhotoHandler = (photoToRemove) => {
    setPhotos((prev) => {
      const updatedPhotos = prev.filter((photo) => photo !== photoToRemove);
      return updatedPhotos;
    });
  };

  return (
    <div>
      <h1>Camera Stream</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div
        style={{
          minWidth: "300px",
          minHeight: "300px",
          border: "1px solid red",
        }}
      >
        <video
          ref={videoRef}
          playsInline
          autoPlay
          style={{ width: "100%" }}
        ></video>
        <button onClick={takePhoto}>Take Photo</button>
        {photos && (
          <div>
            <h2>Captured Photo</h2>
            {photos.map((photo) => {
              return (
                <Fragment key={photo}>
                  <div
                    className=""
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "contain",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => removePhotoHandler(photo)}
                    >
                      X
                    </button>
                    <img src={photo} alt="Captured" style={{ width: "100%" }} />
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
};

export default Camera;
