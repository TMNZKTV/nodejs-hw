const { Contact } = require("../db/contactSchema");

const getContacts = async (owner) => {
  const contacts = await Contact.find({ owner });
  return contacts;
};
const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};
const addContact = async ({ owner, name, email, phone, favorite }) => {
  const newContact = new Contact({ owner, name, email, phone, favorite });
  if (!newContact.favorite) {
    (newContact.favorite = false), await newContact.save();
    return newContact;
  }
  await newContact.save();
};
const deleteContactById = async (id) => {
  await Contact.findByIdAndRemove(id);
};
const updateContactById = async (id, { name, email, phone }) => {
  const body = { name, email, phone };

  const contact = await Contact.findByIdAndUpdate(id, { $set: { ...body } });
  return contact;
};
const updateContactStatusById = async (id, { favorite }) => {
  const contact = await Contact.findByIdAndUpdate(id, {
    $set: { favorite },
  });
  return contact;
};

module.exports = {
  getContacts,
  getContactById,
  addContact,
  updateContactById,
  updateContactStatusById,
  deleteContactById,
};
