const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("././db/contacts.json");

async function listContacts() {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));
    return contacts;
  } catch (error) {
    console.log(error.message);
  }
}

async function getById({ contactId }) {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath, "utf-8"));

    const contact = contacts.find(({ id }) => id.toString() === contactId);
    return contact;
  } catch (error) {
    console.log(error.message);
  }
}
async function removeContact({ contactId }) {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    const contact = contacts.find(({ id }) => id.toString() === contactId);

    const filteredContacts = contacts.filter(
      ({ id }) => id.toString() !== contactId
    );

    const newContacts = await fs.writeFile(
      contactsPath,
      JSON.stringify(filteredContacts)
    );
    return { newContacts, contact };
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(body) {
  const newContact = {
    id: new Date().getTime().toString(),
    ...body,
  };
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    contacts.push(newContact);

    const newContacts = await fs.writeFile(
      contactsPath,
      JSON.stringify(contacts)
    );
    return newContact;
  } catch (error) {
    console.log(error.message);
  }
}

async function updateContact({ contactId }, body) {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));

    const idx = contacts.findIndex(({ id }) => id.toString() === contactId);

    contacts[idx] = {
      ...contacts[idx],
      ...body,
    };
    const updatedContact = contacts[idx];

    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return updatedContact;
  } catch (error) {
    console.log(error.message);
  }
}
module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
