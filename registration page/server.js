require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- 1. Auto-Create Uploads Folder ---
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("📂 Created 'uploads' folder.");
}

// Serve uploads statically
app.use('/uploads', express.static(uploadDir));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ingenuityx')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB Error:', err));

const applicantSchema = new mongoose.Schema({
  registrationId: { type: String, unique: true, required: true },
  
  // FIXED: No longer required or unique since we removed it from the frontend
  username: { type: String, required: false }, 
  
  submittedAt: { type: Date, default: Date.now },
  
  // Basic Info
  name: String,
  email: { type: String, unique: true }, // Strict Unique
  phone: { type: String, unique: true }, // Strict Unique
  city: String,
  
  // Logic
  domain: String, // Added this since it's in your frontend (Tech, Marketing, etc)
  purpose: String,
  work_status: String,
  student_track: String,
  
  // Professional / Academic
  company: String,
  job_title: String,
  yoe: String,
  university: String,
  stream: String,
  
  // Q/A
  skills_list: [String], // Array from frontend
  dream_job: String, // Added from the new vibe check
  brag: String,
  failure: String,
  motivation: String,
  work_role: String,
  experience_elaborate: String,
  proof_links: [String],
  vol_dept: String,
  roast_us: String,
  unpopular_op: String,
  red_flag: String,
  
  // Socials
  interests: [String],
  extra_links: [String],
  linkedin: String,
  instagram: String,

  // Files
  resumePath: String,
  videoPitchPath: String,
  walkthroughPath: String,
  photoPath: String
});

const Applicant = mongoose.model('Applicant', applicantSchema);

// --- 2. CUSTOM FILE NAMING ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    // FIXED: Use the applicant's name or email to name files instead of username
    const identifier = req.body.name || req.body.email || 'applicant';
    const safeName = identifier.split('@')[0].replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    if (file.fieldname === 'photo_blob') {
        cb(null, `${safeName}.jpeg`);
    } else if (file.fieldname === 'hype_video') {
        cb(null, `${safeName}_pitch.webm`);
    } else if (file.fieldname === 'loom_walkthrough') {
        cb(null, `${safeName}_walkthrough.webm`);
    } else if (file.fieldname === 'resume') {
        cb(null, `${safeName}_resume${path.extname(file.originalname)}`);
    } else {
        const ext = path.extname(file.originalname);
        cb(null, `${safeName}_${Date.now()}${ext}`);
    }
  }
});

const upload = multer({ storage });

const generateID = () => {
    return 'IX-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

// --- ROUTE: CHECK USERNAME (Kept for backward compatibility, but not used now) ---
app.get('/api/check-username/:username', async (req, res) => {
    try {
        const user = await Applicant.findOne({ username: req.params.username });
        res.json({ available: !user });
    } catch (error) { res.status(500).json({ error: "Server Error" }); }
});

// --- ROUTE: CHECK CONTACT UNIQUENESS ---
app.post('/api/check-contact', async (req, res) => {
    try {
        const { email, phone } = req.body;
        const conditions = [];
        
        if (email) conditions.push({ email });
        if (phone) conditions.push({ phone });

        if (conditions.length === 0) return res.json({ available: true });

        const existing = await Applicant.findOne({ $or: conditions });
        
        if (existing) {
            return res.json({ available: false });
        }
        res.json({ available: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// --- ROUTE: SUBMIT FORM ---
app.post('/api/submit', 
  upload.fields([
    { name: 'hype_video', maxCount: 1 },
    { name: 'loom_walkthrough', maxCount: 1 },
    { name: 'photo_blob', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
  ]), 
  async (req, res) => {
    try {
      console.log("📝 Received Submission for:", req.body.name || req.body.email);

      const cleanBody = { ...req.body };
      for (const key in cleanBody) {
          if (key.endsWith('[]')) {
              const newKey = key.slice(0, -2);
              cleanBody[newKey] = cleanBody[key];
              delete cleanBody[key];
          }
      }

      // FIXED: Final Backend Validation - Only check Email and Phone
      const orConditions = [];
      if (cleanBody.email) orConditions.push({ email: cleanBody.email });
      if (cleanBody.phone) orConditions.push({ phone: cleanBody.phone });

      if (orConditions.length > 0) {
          const existingUser = await Applicant.findOne({ $or: orConditions });
          if (existingUser) {
            return res.status(400).json({ success: false, message: "Email or Phone already exists." });
          }
      }

      const regId = generateID();
      
      const newApplicant = new Applicant({
        registrationId: regId,
        ...cleanBody,
        videoPitchPath: req.files?.['hype_video']?.[0]?.path || null,
        walkthroughPath: req.files?.['loom_walkthrough']?.[0]?.path || null,
        photoPath: req.files?.['photo_blob']?.[0]?.path || null,
        resumePath: req.files?.['resume']?.[0]?.path || null
      });

      await newApplicant.save();

      console.log(`🎉 Registered: ${regId} - ${cleanBody.name}`);
      res.status(201).json({ success: true, message: "Registered Successfully", id: regId });

    } catch (error) {
      console.error("❌ Submission Error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
});

// --- ROUTE: GET ALL APPLICANTS ---
app.get('/api/applicants', async (req, res) => {
    try {
        const applicants = await Applicant.find().sort({ submittedAt: -1 });
        res.json(applicants);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

// --- ROUTE: DELETE APPLICANT ---
app.delete('/api/applicants/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Applicant.findById(id);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const filesToDelete = [
            user.videoPitchPath, 
            user.walkthroughPath, 
            user.photoPath, 
            user.resumePath
        ];
        
        filesToDelete.forEach(filePath => {
            if (filePath) {
                const absolutePath = path.join(__dirname, filePath);
                if (fs.existsSync(absolutePath)) fs.unlinkSync(absolutePath);
            }
        });

        await Applicant.deleteOne({ _id: id });

        console.log(`🗑️ Deleted User: ${user.name || user.email}`);
        res.json({ success: true, message: "Deleted successfully" });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));