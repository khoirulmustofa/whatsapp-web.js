const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const port = 3000;

// Configure Multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads"); // Upload files to the 'uploads' directory
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        callback(null, Date.now() + ext); // Append a timestamp to the filename
    },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

// Handle form submission and file upload
app.post("/send-media", upload.single("fileInput"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    // Access form input fields
    const number = req.body.number;
    const messege = req.body.messege;

    const file = req.file;

    if (!file) {
        return res.status(400).send("No file uploaded.");
    }

    fs.readFile(file.path, "base64", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).send("Internal Server Error");
        }
        const mimetype = file.mimetype;
        const base64String = data;
        const name = file.originalname;

        console.log(file);

        // Now you can use mimetype, base64, and name as needed
        res.status(200).json({ mimetype, base64String, name });
    });
});

app.post("/send-message", upload.single("fileInput"), async (req, res) => {
    const number = req.body.number;
    const messege = req.body.messege;
    res.status(200).json({ number, messege });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
