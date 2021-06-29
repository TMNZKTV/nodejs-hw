const express = require("express");
const router = new express.Router();

const {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
  updateContactStatusController,
} = require("../../src/controllers/contactsControllers");

const { authMiddleware } = require("../../src/middlewares/authMiddleware");

const {
  addContactValidation,
  updateContactValidation,
} = require("../../src/middlewares/validators");

router.use(authMiddleware);

router.get("/", getContactsController);

router.get("/:id", getContactByIdController);

router.post("/", addContactValidation, addContactController);

router.put("/:id", updateContactValidation, updateContactController);

router.patch(
  "/:id/favorite",
  updateContactValidation,
  updateContactStatusController
);

router.delete("/:id", deleteContactController);

module.exports = {
  contactsRouter: router,
};
