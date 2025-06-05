// === BACKEND: server/routes/application.js ===
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

router.post('/', async (req, res) => {
  try {
    const application = new Application(req.body);
    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/candidate/:id', async (req, res) => {
  try {
    const apps = await Application.find({ candidateId: req.params.id }).populate('jobId');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
