const InspectionReport = require('../models/inspectionReport')
const isNumber = require('../utils/isNumber')

exports.UpdateInspectionReport = async (req, res) => {
  try {
    const uid = req.params.uid;
    const { receptionDate, currentCarValue, initialCarValue } = req.body;
    let errors = [];

    if (!uid)
      errors.push('ID of InspectionReport is required.');

    if (receptionDate && isNaN(Date.parse(receptionDate)))
      errors.push('Invalid receptionDate format');

    if (!isNumber(currentCarValue))
      errors.push('Invalid currentCarValue value type');

    if (!isNumber(initialCarValue))
        errors.push('Invalid initialCarValue value type');

    const dbChecks = []

    const updatedInspectionReport = await InspectionReport.findOneAndUpdate(
      { _id: uid },
      { $set: { receptionDate, currentCarValue, initialCarValue } },
      { new: true },
    );

    if (!updatedInspectionReport) dbChecks.push('InspectionReport not found')

    // Execute all checks in parallel
    const checkResults = await Promise.all(dbChecks);
    errors = errors.concat(checkResults.filter(result => result !== null));
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    res.status(200).json({updatedInspectionReport });
  } catch (error) {
    console.error(error);
    res.status(500).json({error: error.message });
  }
};
