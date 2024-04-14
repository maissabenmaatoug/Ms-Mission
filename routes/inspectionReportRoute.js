const express = require('express')
const router = express.Router()
const { UpdateInspectionReport } = require('../controllers/inspectionReportController')






/**
 * @swagger
 * paths:
 *   /updateInspectionReport/{uid}:
 *     put:
 *       tags:
 *         - Inspection Reports
 *       summary: Update an existing inspection report using its uid.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: uid
 *           in: path
 *           required: true
 *           type: string
 *           description: Unique identifier (uid) of the inspection report.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               # Optional properties for partial updates
 *               type: object
 *               properties:
 *                 receptionDate:
 *                   type: string
 *                   format: date
 *                   description: Updated date the inspection report was received (optional).
 *                 currentCarValue:
 *                   type: number
 *                   description: Updated current value of the car being inspected (optional).
 *                 initialCarValue:
 *                   type: number
 *                   description: Updated initial value of the car being inspected (optional).
 *                 # Consider other potentially updatable properties
 *       responses:
 *         200:
 *           description: Inspection report updated successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message.
 *         400:
 *           description: Bad request, invalid inspection report data.
 *         404:
 *           description: Inspection Report not found.
 */
router.put('/updateInspectionReport/:uid', UpdateInspectionReport);
module.exports = router