import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier public
app.use(express.static(__dirname));

// Vérifier que le dossier images/projects existe
const uploadDir = path.join(__dirname, "images", "projects");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration Multer
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = Date.now() + ext;
        cb(null, name);
    }
});

const upload = multer({ storage });

// Route d'upload
app.post("/upload", upload.single("image"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Aucune image reçue."
        });
    }

    res.json({
        success: true,
        filename: req.file.filename,
        path: "images/projects/" + req.file.filename
    });

});

// Démarrage du serveur
app.listen(PORT, () => {

    console.log("==================================");
    console.log("ASC WEBSITE");
    console.log("Serveur démarré");
    console.log("http://localhost:3000");
    console.log("==================================");

});