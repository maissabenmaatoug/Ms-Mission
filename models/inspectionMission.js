const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const inspectionMissionSchema = new Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  missionDate: {
    type: Date,
    required: true
  },
  missionType: {
    type: String,
    required: true,
    enum: ['FIRST_INSPECTION', 'SECOND_INSPECTION', 'THIRD_INSPECTION']
  },
  status: {
    type: String,
    required: true,
    enum: ['OPEN', 'ON_GOING', 'DECLINED', 'CLOSED']
  },
  assignedExpert: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  relatedClaimUid: {
    type: String
  },
  inspectionMissionReports: [{ type: Schema.Types.ObjectId, ref: 'inspectionReport' }]

});

module.exports = mongoose.model('inspectionMission', inspectionMissionSchema);
