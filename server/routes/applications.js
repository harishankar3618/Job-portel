const express = require('express');
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Multer setup for resume file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/resumes'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + '-' + Date.now() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: function (req, file, cb) {
    const allowed = /pdf|doc|docx/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  }
});

// POST /api/applications - Apply for a job (Candidate only)
router.post(
  '/',
  auth,
  authorize(['candidate']),
  upload.single('resume'),
  async (req, res) => {
    try {
      const { jobId, coverLetter, resumeUrl } = req.body;

      // Check if job exists
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ message: 'Job not found' });

      // Check if already applied
      const existing = await Application.findOne({
        job: jobId,
        applicant: req.user._id,
      });
      if (existing)
        return res.status(400).json({ message: 'You have already applied for this job' });

      // Determine resume path (uploaded file or fallback URL)
      let resumePath = null;
      if (req.file) {
        resumePath = `/uploads/resumes/${req.file.filename}`;
      } else if (resumeUrl) {
        resumePath = resumeUrl;
      }

      // Create application
      const application = new Application({
        job: jobId,
        applicant: req.user._id,
        coverLetter,
        resume: resumePath,
      });

      await application.save();

      // Increment applicationsCount on job
      await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

      await application.populate([
        { path: 'job', select: 'title company' },
        { path: 'applicant', select: 'name email' },
      ]);

      res.status(201).json(application);
    } catch (error) {
      console.error(error);
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// GET /api/applications/my-applications - Candidate's applications
router.get('/my-applications', auth, authorize(['candidate']), async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location jobType salary')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/job/:jobId - Applications for a job (Employer only)
router.get('/job/:jobId', auth, authorize(['employer']), async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.employer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email profile')
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/applications/:id/status - Update application status (Employer only)
router.put('/:id/status', auth, authorize(['employer']), async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.job.employer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    application.status = status;
    if (notes) application.notes = notes;

    await application.save();
    await application.populate('applicant', 'name email');

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/applications/:id - Get single application (Applicant or Employer)
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location employer')
      .populate('applicant', 'name email profile');

    if (!application) return res.status(404).json({ message: 'Application not found' });

    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isJobOwner = application.job.employer &&
      application.job.employer.toString() === req.user._id.toString();

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/applications/:id - Withdraw application (Applicant only)
router.delete('/:id', auth, authorize(['candidate']), async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    if (application.applicant.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Access denied' });

    await Application.findByIdAndDelete(req.params.id);

    await Job.findByIdAndUpdate(application.job, { $inc: { applicationsCount: -1 } });

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
