const express = require('express');
const path = require('path');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const performGoogleVisionDetection = require('./performGoogleVisionDetection');

// Create an instance of the Express application
const app = express();
const port = 3001; // Choose the port you want to run your server on

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Configure your Google Cloud Storage credentials
const storageClient = new Storage({
  projectId: 'reciept-scanner-project',
  keyFilename: 'reciept-scanner-project-a9b0f9c7b421.json'
});

// Serve the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageFile = req.file;
    const imagePath = imageFile.path;

    // Upload the file to Google Cloud Storage
    const bucketName = 'reciept-scanner-bucket';
    const bucket = storageClient.bucket(bucketName);
    await bucket.upload(imagePath);

    // Perform Google Vision detection on the uploaded image
    const labels = await performGoogleVisionDetection(imagePath);

    // Return the labels as the API response
    res.json({ labels });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

// Handle other API routes or additional server logic as needed

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
