const InspectionMission = require('../models/inspectionMission')
const InspectionReport = require('../models/inspectionReport')
const generateRandomUID = require('../utils/utilities')
const isNumber = require('../utils/isNumber')

exports.createInspectionMission = async (req, res) => {
  try {
    const {
      currentCarValue,
      initialCarValue,
      missionType,
      assignedExpert,
      location,
      status,
      relatedClaimUid, //will be updated later
    } = req.body;

    const missionDate = new Date();
    let errors = [];

    if (!isNumber(currentCarValue)) errors.push('Invalid currentCarValue value type');
    if (!isNumber(initialCarValue)) errors.push('Invalid initialCarValue value type');

    // Validate missionDate format
    if (isNaN(Date.parse(missionDate))) errors.push('Invalid missionDate format. Please provide a valid date.');

    // Validate missionType against enum values
    if (!InspectionMission.schema.path('missionType').enumValues.includes(missionType))
      errors.push(`missionType should be one of these options: ${InspectionMission.schema.path('missionType').enumValues}`);

    // Validate status against enum values
    if (!InspectionMission.schema.path('status').enumValues.includes(status))
      errors.push(`status should be one of these options: ${InspectionMission.schema.path('status').enumValues}`);


    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Generating random UID & code
    const uid = generateRandomUID('I');
    const code = generateRandomUID('I');

    // Creating new inspection mission object
    const newInspectionMission = new InspectionMission({
      uid,
      code,
      missionDate,
      currentCarValue,
      initialCarValue,
      missionType,
      status: status || 'OPEN',
      assignedExpert,
      location,
      relatedClaimUid,
    });

    // Saving the new inspection mission to the database
    const createdInspectionMission = await newInspectionMission.save();

    res.status(201).json(createdInspectionMission);
  } catch (error) {
    console.error('Error creating inspection mission:', error);
    res.status(500).json({ error: 'Failed to create inspection mission' });
  }
}

exports.updateInspectionMission = async (req, res) => {
  try {
    const uidMission = req.params.uid;
    const { missionType, assignedExpert, location, status } = req.body;
    let errors = [];

    if (!InspectionMission.schema.path('status').enumValues.includes(status))
      errors.push(`status should be one of these options: ${InspectionMission.schema.path('status').enumValues}`);

    if (!InspectionMission.schema.path('missionType').enumValues.includes(missionType))
      errors.push(`missionType should be one of these options: ${InspectionMission.schema.path('missionType').enumValues}`);

    const dbChecks = [];

    const updatedMission = await InspectionMission.findOneAndUpdate(
      { uid: uidMission },
      { $set: { missionType, assignedExpert, location, status } },
      { new: true },
    );

    if (!updatedMission) dbChecks.push('Mission not found')

    // Execute all checks in parallel
    const checkResults = await Promise.all(dbChecks);
    errors = errors.concat(checkResults.filter(result => result !== null));
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    res.status(200).json({ updatedMission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

exports.addInspectionReportToMission = async (req, res) =>  {
  try {
    const { inspectionMissionUid, reportData } = req.body;
    let errors = [];

    if (!inspectionMissionUid || !reportData)
      errors.push('InspectionMissionUiD and reportData are required.');

    if (reportData.receptionDate && isNaN(Date.parse(reportData.receptionDate)))
      errors.push('Invalid receptionDate format.');

    if (!isNumber(reportData.currentCarValue))
      errors.push('Invalid currentCarValue value type');

    if (!isNumber(reportData.initialCarValue))
      errors.push('Invalid initialCarValue value type');

    const dbChecks = [];

    const existingReport = await InspectionReport.findOne({ code: reportData.code });
    if (existingReport) dbChecks.push('The code must be unique.');

    const inspectionMission = await InspectionMission.findOne({ uid: inspectionMissionUid });
    if (!inspectionMission) dbChecks.push('Inspection mission is not found.');

    // Execute all checks in parallel
    const checkResults = await Promise.all(dbChecks);
    errors = errors.concat(checkResults.filter(result => result !== null));
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const inspectionReport = new InspectionReport({
      code: reportData.code,
      receptionDate: reportData.receptionDate,
      currentCarValue: reportData.currentCarValue,
      initialCarValue: reportData.initialCarValue,
    });

    try {
      await inspectionMission.validate();
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    await inspectionReport.save();
    inspectionMission.inspectionMissionReports.push(inspectionReport._id);
    await inspectionMission.save();

    res.status(200).json(inspectionMission);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message });
  }
}

exports.getInspectionMission = async (req, res) =>  {
  try {
    const uid = req.params.uid

    // Find the inspection mission by UID
    const inspectionMission = await InspectionMission.findOne({ uid }).populate('inspectionMissionReports');

    if (!inspectionMission) {
      return res.status(404).json({ error: 'Mission not found' })
    }

    res.status(200).json(inspectionMission)
  } catch (error) {
    console.error('Error retrieving inspection mission:', error)
    res.status(500).json({ error: 'Failed to retrieve inspection mission' })
  }
}

exports.filterInspectionMissions = async (req, res) =>  {
  const { code, missionType, status, assignedExpert, location, missionDate } =
    req.body.filters

  try {
    let result = await InspectionMission.find({}).populate(
      'inspectionMissionReports',
    );
    let errors = [];
  if(!code  && !missionType && !status && !assignedExpert  && !location && !missionDate)
   errors.push('At least one filter is required.')   
   if (!result || result.length === 0) {
    errors.push('No inspection missions found.')
  }

   if (errors.length > 0) {
    return res.status(400).json({ errors });
}

    if (code !== '') {
      result = result.filter((mission) => mission.code === code)
    }

    if (missionType !== '') {
      result = result.filter((mission) => mission.missionType === missionType)
    }

    if (status !== '') {
      result = result.filter((mission) => mission.status === status)
    }

    if (assignedExpert !== '') {
      result = result.filter(
        (mission) => mission.assignedExpert === assignedExpert,
      )
    }

    if (location !== '') {
      result = result.filter((mission) => mission.location === location)
    }
 if(missionDate){
    if (!Array.isArray(missionDate) && missionDate.length != 2) {
      return res.status(400).json({ error: 'Mission Date should be an array.' })
    } else {
      if (missionDate[0] != '' && missionDate[1] != '') {
        const dateMin = new Date(missionDate[0])
        const dateMax = new Date(missionDate[1])

        if (dateMin <= dateMax)
          result = result.filter(
            (doc) => doc.missionDate >= dateMin && doc.missionDate <= dateMax,
          )
        else {
          return res.status(400).json({ error: 'issue dateMin or dateMax .' })
        }
      } else if (missionDate[0] != '') {
        const dateMin = new Date(missionDate[0])

        result = result.filter((doc) => doc.missionDate >= dateMin)
      } else if (missionDate[1] != '') {
        const dateMax = new Date(missionDate[1])
        result = result.filter((doc) => doc.missionDate <= dateMax)
      }
    }
  }
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({error: error.message })
  }
}

exports.UpdateStatusFoInspectionMission = async (req, res) =>  {
  const { status } = req.body
  const uid  = req.params.uid
  let errors = [];

  try {
      if (!InspectionMission.schema.path('status').enumValues.includes(status))
        errors.push(`status should be one of these options: ${InspectionMission.schema.path('status').enumValues}`);
      
      const updateStatusMission = await InspectionMission.findOneAndUpdate(
        { uid: uid },
        { $set: {  status } },
        { new: true },
      )
      const dbChecks = []
      if (!updateStatusMission) dbChecks.push('Mission not found')

      // Execute all checks in parallel
      const checkResults = await Promise.all(dbChecks);
      errors = errors.concat(checkResults.filter(result => result !== null));
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

    res.status(200).json({ updateStatusMission })

    } catch (error) {
      console.error(error)
      res.status(500).json({error: error.message })
    }
}

