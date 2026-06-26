const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Campground = require("../models/campground.js");

const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../middleware.js");

/**
 * @swagger
 * /api/campgrounds:
 *   get:
 *     summary: Get all campgrounds
 *     tags: [Campgrounds]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of campgrounds per page
 *     responses:
 *       200:
 *         description: List of all campgrounds
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campgrounds:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Campground'
 *                 cluster:
 *                   type: object
 *                   description: GeoJSON cluster data for map display
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Create a new campground
 *     tags: [Campgrounds]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - campground[title]
 *               - campground[location]
 *               - campground[price]
 *             properties:
 *               campground[title]:
 *                 type: string
 *                 example: Mountain View Campground
 *               campground[location]:
 *                 type: string
 *                 example: Yosemite National Park, CA
 *               campground[price]:
 *                 type: number
 *                 example: 25.99
 *               campground[description]:
 *                 type: string
 *                 example: A beautiful campground with stunning views
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Campground images (multiple files)
 *     responses:
 *       201:
 *         description: Campground created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campground:
 *                   $ref: '#/components/schemas/Campground'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - login required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

// Removed: server-side rendering route for new campground form

/**
 * @swagger
 * /api/campgrounds/{id}:
 *   get:
 *     summary: Get a specific campground by ID
 *     tags: [Campgrounds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campground ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Campground details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campground:
 *                   $ref: '#/components/schemas/Campground'
 *       404:
 *         description: Campground not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     summary: Update a campground
 *     tags: [Campgrounds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campground ID
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               campground[title]:
 *                 type: string
 *                 example: Updated Mountain View
 *               campground[location]:
 *                 type: string
 *                 example: Updated location
 *               campground[price]:
 *                 type: number
 *                 example: 30.99
 *               campground[description]:
 *                 type: string
 *                 example: Updated description
 *               image:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               deleteImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image filenames to delete
 *     responses:
 *       200:
 *         description: Campground updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 campground:
 *                   $ref: '#/components/schemas/Campground'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - not the author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Campground not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     summary: Delete a campground
 *     tags: [Campgrounds]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Campground ID
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Campground deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Campground deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - not the author
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Campground not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// Removed: server-side rendering route for edit campground form

module.exports = router;
