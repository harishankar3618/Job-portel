// === BACKEND: server/models/Application.js ===
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'Applied' },
});

module.exports = mongoose.model('Application', applicationSchema);