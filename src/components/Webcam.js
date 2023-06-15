import React, { useRef } from 'react';
import Webcam from 'react-webcam';
const vision = require('@google-cloud/vision');

async function performGoogleVisionDetection(imagePath) {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    // Performs label detection on the image file
    const [result] = await client.labelDetection(imagePath);
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
  
    // Return the labels or handle them as needed in your application
    return labels;
  }
  


const Scan = (props) => {
    const webcamRef = useRef(null);
  
    const takePicture = () => {
      const imageSrc = webcamRef.current.getScreenshot();
      // Call the Google Vision detection function
         performGoogleVisionDetection(imageSrc);
    };
  
    return (
      <div>
        {/* React Webcam View */}
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
  
        {/* Click here for taking picture */}
        <button onClick={takePicture}>SNAP</button>
      </div>
    );
  };
  

export default Scan;
