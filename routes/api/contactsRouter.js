const express = require("express");
const router = new express.Router();

const {
  getContacts,
  getContactById,
  postContact,
  deleteContact,
  putContact,
} = require("../../src/controllers/contactsControllers");

const {
  postContactValidation,
  putContactValidation,
} = require("../../src/validators/validators");

router.get("/", getContacts);

router.get("/:contactId", getContactById);

router.post("/", postContactValidation, postContact);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", putContactValidation, putContact);

module.exports = {
  contactsRouter: router,
};
