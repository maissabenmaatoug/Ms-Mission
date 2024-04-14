const express = require('express')
const { createInspectionMission ,updateInspectionMission,addInspectionReportToMission, getInspectionMission,filterInspectionMissions , UpdateStatusFoInspectionMission } = require('../controllers/inspectionMissionController')
const router = express.Router()

/**
 * @swagger
 * definitions:
 *   NewInspectionMission:
 *     type: object
 *     tags : 
 *     required:
 *       - code
 *       - receptionDate
 *       - missionDate
 *       - currentCarValue
 *       - initialCarValue
 *       - missionType
 *     properties:
 *       code:
 *         type: string
 *         description: Unique identifier for the inspection mission.
 *       receptionDate:
 *         type: string
 *         format: date
 *         description: Date the inspection mission was received.
 *       missionDate:
 *         type: string
 *         format: date
 *         description: Date the inspection mission is scheduled for.
 *       currentCarValue:
 *         type: number
 *         description: Current value of the car being inspected.
 *       initialCarValue:
 *         type: number
 *         description: Initial value of the car being inspected.
 *       missionType:
 *         type: string
 *         enum:
 *           - FIRST_INSPECTION
 *           - SECOND_INSPECTION
 *           - THIRD_INSPECTION
 *         description: Type of inspection mission.
 *       assignedExpert:
 *         type: string
 *         description: Expert assigned to the inspection mission (optional).
 *       location:
 *         type: string
 *         description: Location of the inspection mission (optional).
 *       relatedClaimUid:
 *         type: string
 *         description: ID of the related claim (optional).
 *   CreatedInspectionMission:
 *     type: object
 *     properties:
 *       uid:
 *         type: string
 *         description: Unique identifier for the created inspection mission.
 *       code:
 *         type: string
 *         description: Provided code.
 *       receptionDate:
 *         type: string
 *         format: date
 *         description: Provided reception date.
 *       missionDate:
 *         type: string
 *         format: date
 *         description: Provided mission date.
 *       currentCarValue:
 *         type: number
 *         description: Provided current car value.
 *       initialCarValue:
 *         type: number
 *         description: Provided initial car value.
 *       missionType:
 *         type: string
 *         description: Provided mission type.
 *       status:
 *         type: string
 *         enum:
 *           - OPEN
 *         description: Automatically set status.
 *       assignedExpert:
 *         type: string
 *         description: Returned if provided.
 *       location:
 *         type: string
 *         description: Returned if provided.
 *       relatedClaimUid:
 *         type: string
 *         description: Returned if provided.
 *       createdAt:
 *         type: string
 *         format: date-time
 *         description: Date the mission was created.
 *       updatedAt:
 *         type: string
 *         format: date-time
 *         description: Date the mission was last updated.
 * paths:
 *   /inspectionMission:
 *     post:
 *       tags:
 *         - Inspection Missions
 *       summary: Create a new inspection mission.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/NewInspectionMission'
 *       responses:
 *         201:
 *           description: Created inspection mission details.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/CreatedInspectionMission'
 *         400:
 *           description: Bad request, invalid inspection missiondata.
 */

router.post('/inspectionMission', createInspectionMission);
/**
 * @swagger
 * paths:
 *   /inspectionReport:
 *     post:
 *       tags:
 *         - Inspection Reports
 *       summary: Add an inspection report to an existing inspection mission.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: uid
 *           in: path
 *           required: true
 *           type: string
 *           description: Unique identifier of the inspection mission.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/InspectionReport' # Define a reference to the inspectionReportSchema
 *       responses:
 *         201:
 *           description: Inspection report added successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: Success message.
 *         400:
 *           description: Bad request, invalid report data.
 *         404:
 *           description: Mission not found.
 * definitions:
 *   InspectionReport:
 *     type: object
 *     required:
 *       - code
 *       - receptionDate
 *       - currentCarValue
 *       - initialCarValue
 *     properties:
 *       code:
 *         type: string
 *         description: Unique identifier for the inspection report.
 *       receptionDate:
 *         type: string
 *         format: date
 *         description: Date the inspection report was received.
 *       currentCarValue:
 *         type: number
 *         description: Current value of the car being inspected.
 *       initialCarValue:
 *         type: number
 *         description: Initial value of the car being inspected.
 */

router.post('/addInspectionReportToMission', addInspectionReportToMission);



/**
 * @swagger
 * paths:
 *   /inspectionMission/{uid}:
 *     get:
 *       tags:
 *         - Inspection Missions
 *       summary: Get details of a specific inspection mission.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: uid
 *           in: path
 *           required: true
 *           type: string
 *           description: Unique identifier of the inspection mission.
 *       responses:
 *         200:
 *           description: Inspection mission details.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/CreatedInspectionMission' # Reuse previous definition or create a new one for retrieved mission details
 *         404:
 *           description: Mission not found.
 */
router.get('/inspectionMission/:uid', getInspectionMission);


/**
 * @swagger
 * paths:
 *   /updateMission/{uid}:
 *     put:
 *       tags:
 *         - Inspection Missions
 *       summary: Update details of an existing inspection mission.
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - name: uid
 *           in: path
 *           required: true
 *           type: string
 *           description: Unique identifier of the inspection mission.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentCarValue:
 *                   type: number
 *                   description: Updated current value of the car being inspected (optional).
 *                 initialCarValue:
 *                   type: number
 *                   description: Updated initial value of the car being inspected (optional).
 *                 missionType:
 *                   type: string
 *                   enum:
 *                     - FIRST_INSPECTION
 *                     - SECOND_INSPECTION
 *                     - THIRD_INSPECTION
 *                   description: Updated type of inspection mission (optional).
 *                 assignedExpert:
 *                   type: string
 *                   description: Updated expert assigned to the inspection mission (optional).
 *                 location:
 *                   type: string
 *                   description: Updated location of the inspection mission (optional).
 *                 relatedClaimUid:
 *                   type: string
 *                   description: Updated ID of the related claim (optional).
 *       responses:
 *         200:
 *           description: Updated inspection mission details.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/CreatedInspectionMission' # Reuse previous definition or create a new one for updated mission details
 *         400:
 *           description: Bad request, invalid update data.
 *         404:
 *           description: Mission not found.
 */
router.put('/updateMission/:uid', updateInspectionMission);

/**
 * @swagger
 * paths:
 *   /inspectionMission/updateStatus:
 *     put:
 *       tags:
 *         - Inspection Missions
 *       summary: Update the status of an existing inspection mission.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - uid
 *                 - status
 *               properties:
 *                 uid:
 *                   type: string
 *                   description: Unique identifier of the inspection mission.
 *                 status:
 *                   type: string
 *                   enum:
 *                     - OPEN
 *                     - ON_GOING
 *                     - DECLINED
 *                     - CLOSED
 *                   description: New status for the inspection mission.
 *       responses:
 *         200:
 *           description: Updated inspection mission details.
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/definitions/CreatedInspectionMission' # Reuse previous definition or create a new one for updated mission details
 *         400:
 *           description: Bad request, invalid data provided.
 *         404:
 *           description: Mission not found.
 */
router.put('/inspectionMission/updateStatus/:uid', UpdateStatusFoInspectionMission);
/**
 * @swagger
 * paths:
 *   /inspectionMission/filter:
 *     post:
 *       tags:
 *         - Inspection Missions
 *       summary: Filter inspection missions based on criteria.
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 # Define properties for filtering criteria
 *                 # Examples:
 *                 - missionDate:
 *                       type: string
 *                       format: date
 *                       description: Filter by mission date (optional).
 *                 - missionType:
 *                       type: string
 *                       enum:
 *                         - FIRST_INSPECTION
 *                         - SECOND_INSPECTION
 *                         - THIRD_INSPECTION
 *                       description: Filter by mission type (optional).
 *                 - status:
 *                       type: string
 *                       enum:
 *                         - OPEN
 *                         - ON_GOING
 *                         - DECLINED
 *                         - CLOSED
 *                       description: Filter by mission status (optional).
 *                 # ... (add other potential filter criteria)
 *       responses:
 *         200:
 *           description: List of inspection missions matching the filter.
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/definitions/CreatedInspectionMission' # Reuse previous definition or create a new one for filtered mission details
 *         400:
 *           description: Bad request, invalid filter criteria.
 */
router.post('/filterInspectionMission', filterInspectionMissions)

module.exports = router