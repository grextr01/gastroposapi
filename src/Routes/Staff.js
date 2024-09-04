const express = require("express");
const router = express.Router();
const {
  createNewStaff,
  checkOldPassword,
  updatePassword,
  deleteStaff,
  updateStaff,
  getAllStaff
} = require("../Services/StaffService");
const { authenticate, authorize } = require("../Services/AuthService");
const { tryCatch, tryCatchAsync } = require("../Services/utils/TryCatch");
const {
  validateUser,
  validatePasswordUpdate,
  validUserInfoUpdate
} = require("../Services/utils/Validator");

router.get(
  "/api/staff",
  authenticate,
  authorize,
  tryCatch((req, res) => {
    const data = getAllStaff();
    return res.status(200).json({
      staff: data
    });
  })
);

router.post(
  "/api/staff",
  authenticate,
  authorize,
  validateUser,
  tryCatch((req, res) => {
    const body = req.body;
    createNewStaff(body);
    return res.status(201).json({
      message: "Staff Was Succesfully created"
    });
  })
);

router.put(
  "/api/staff/updatepassword",
  authenticate,
  validatePasswordUpdate,
  tryCatchAsync(async (req, res) => {
    const userId = req.userId;
    const body = req.body;
    const valid = await checkOldPassword(userId, body.oldPassword);
    if (!valid) {
      return res.status(400).json({
        message: "Incorrect Old Password"
      });
    }
    updatePassword(userId, body.newPassword);
    return res.status(200).json({
      message: "Password was updated Successfully"
    });
  })
);

router.delete(
  "/api/staff/:id",
  authenticate,
  authorize,
  tryCatch((req, res) => {
    const staffId = req.params.id;
    deleteStaff(staffId);
    return res.status(200).json({
      message: "Staff Was deleted"
    });
  })
);

router.put(
  "/api/staff",
  authenticate,
  validUserInfoUpdate,
  tryCatch((req, res) => {
    const staffId = req.userId;
    const body = req.body;
    updateStaff(staffId, body);
    return res.status(200).json({
      message: "User Info Were updated"
    });
  })
);

module.exports = router;
