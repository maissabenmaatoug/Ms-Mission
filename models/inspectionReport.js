const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inspectionReportSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  receptionDate: {
    type: Date,
    required: true
  },
  currentCarValue: {
    type: Number,
    required: true
  },
  initialCarValue: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('inspectionReport', inspectionReportSchema);
