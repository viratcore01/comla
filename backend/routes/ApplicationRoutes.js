import express from "express";
import Application from "../models/Application.js";
import { authenticateToken } from "../middleware/auth.js";
import { upload, uploadToCloudinary, isCloudinaryConfigured } from "../utils/fileUpload.js";
import { sendEmail, emailTemplates } from "../utils/email.js";
const router = express.Router();

// Apply to a college (requires auth)
router.post("/apply", authenticateToken, upload.array('documents', 5), async (req, res) => {
  try {
    const { collegeId } = req.body;
    const studentId = req.user.id; // From JWT

    // Check if application already exists
    const existingApp = await Application.findOne({ student: studentId, college: collegeId });
    if (existingApp) {
      return res.status(400).json({ error: "Application already exists" });
    }

    let documents = [];

    if (req.files && req.files.length > 0) {
      if (isCloudinaryConfigured()) {
        // Upload files to Cloudinary
        const uploadPromises = req.files.map(async (file) => {
          try {
            const result = await uploadToCloudinary(file.buffer, file.originalname);
            return result.secure_url;
          } catch (uploadError) {
            console.error('Cloudinary upload error:', uploadError);
            throw uploadError;
          }
        });
        documents = await Promise.all(uploadPromises);
      } else {
        // Use local file URLs
        documents = req.files.map(file => `http://localhost:3000/uploads/${file.filename}`);
      }
    }

    const newApp = new Application({ student: studentId, college: collegeId, documents });
    await newApp.save();

    res.json({ message: "Application submitted", application: newApp });
  } catch (err) {
    console.error('Error creating application:', err);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// Get applications of a student (requires auth, own applications only)
router.get("/:studentId", authenticateToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.studentId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const applications = await Application.find({ student: req.params.studentId })
      .populate('college', 'name location')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Withdraw application (requires auth)
router.delete("/:applicationId", authenticateToken, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.student.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Application.findByIdAndDelete(req.params.applicationId);
    res.json({ message: "Application withdrawn" });
  } catch (err) {
    console.error('Error withdrawing application:', err);
    res.status(500).json({ error: "Failed to withdraw application" });
  }
});

// Get applications for a college (requires auth, college role)
router.get("/college/:collegeId", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'college' || req.user.collegeId.toString() !== req.params.collegeId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const applications = await Application.find({ college: req.params.collegeId })
      .populate('student', 'name email')
      .populate('college', 'name')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error('Error fetching college applications:', err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

// Update application status (requires auth, college role)
router.put("/:applicationId/status", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const application = await Application.findById(req.params.applicationId).populate('college student');
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (req.user.role !== 'college' || req.user.collegeId.toString() !== application.college._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    application.status = status;
    await application.save();

    // Send email notification
    try {
      const emailTemplate = emailTemplates.applicationStatusUpdate(
        application.student.name,
        application.college.name,
        status
      );
      await sendEmail(application.student.email, emailTemplate.subject, emailTemplate.html);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    res.json({ message: "Status updated", application });
  } catch (err) {
    console.error('Error updating application status:', err);
    res.status(500).json({ error: "Failed to update status" });
  }
});

export default router;
