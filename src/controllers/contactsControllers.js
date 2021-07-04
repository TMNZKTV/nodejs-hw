const {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  updateContactStatusById,
  deleteContactById,
} = require("../services/contactsServices");

const getContactsController = async (req, res) => {
  const owner = req.userId;

  try {
    const contacts = await getContacts(owner);
    res.json({ contacts });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to get contacts with error: ${error.message}` });
  }
};

const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (!contact) {
    res.status(500).json({ message: "Contact not found" });
  }
  res.json({ contact, message: "contact found" });
};

const addContactController = async (req, res) => {
  const { name, email, phone, favorite } = req.body;
  const owner = req.userId;

  try {
    await addContact({ owner, name, email, phone, favorite });
    res.json({ message: "Success!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Can not add contact with error: ${error.message}` });
  }
};

const updateContactController = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  try {
    const contact = await updateContactById(id, { name, email, phone });

    res.json({ message: "successfully updated" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to update with error: ${error.message}` });
  }
};

const deleteContactController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteContactById(id);
    res.json({ message: `Contact has been successfully deleted` });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Failed to delete with error: ${error.message}` });
  }
};

const updateContactStatusController = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  try {
    const contact = await updateContactStatusById(id, { favorite });

    if (!favorite) {
      res.status(400).json({ message: "missing field favorite" });
    }
    res.status(200).json({
      contact: { id, favorite },
      message: "status updated",
    });
  } catch (error) {
    res.status(500).json({ message: "not found" });
  }
};

module.exports = {
  getContactsController,
  getContactByIdController,
  addContactController,
  updateContactController,
  deleteContactController,
  updateContactStatusController,
};
