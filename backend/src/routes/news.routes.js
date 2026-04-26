const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ctrl = require("../controllers/news.controller");
const auth = require("../middlewares/auth.middleware");

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    cb(null, `${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  }
});

router.use(auth.verifyToken);

router.post("/", upload.single("image"), ctrl.create);
router.get("/", ctrl.getAll);
router.put("/:id", upload.single("image"), ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;
