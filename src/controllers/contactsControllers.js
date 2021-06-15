const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require("../services/contactsServices");

const getContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ contacts });
  } catch (error) {
    console.log(error.message);
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await getById(req.params);

    if (!contact) {
      return res.status(400).json({ message: "Contact not found" });
    }
    res.status(200).json({ contact });
  } catch (error) {
    console.log(error.message);
  }
};

const postContact = async (req, res) => {
  try {
    const newContact = await addContact(req.body);

    res.status(201).json({ newContact });
  } catch (error) {
    console.log(error.message);
  }
};

const deleteContact = async (req, res) => {
  try {
    const { contacts, contact } = await removeContact(req.params);
    if (!contact) {
      return res.status(404).json({ message: "not found" });
    }
    res.status(200).json({ message: "contact deleted", contacts });
  } catch (error) {
    console.log(error.message);
  }
};

const putContact = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "missing fields" });
    }

    const updatedContact = await updateContact(req.params, req.body);

    if (updatedContact) {
      return res.status(200).json({
        message: "contact updated",
        contacts: {
          contact: updatedContact,
        },
      });
    } else {
      return res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getContacts,
  getContactById,
  postContact,
  deleteContact,
  putContact,
};
