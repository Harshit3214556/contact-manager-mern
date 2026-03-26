const Contact = require('../models/Contact');

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts' });
  }
};

exports.createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required' });
    }

    const contact = new Contact({ name: name.trim(), email: email?.trim() || '', phone: phone?.trim() || '' });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contact' });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (name !== undefined) contact.name = name.trim();
    if (email !== undefined) contact.email = email.trim();
    if (phone !== undefined) contact.phone = phone.trim();

    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact' });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact' });
  }
};
