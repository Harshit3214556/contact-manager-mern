const express = require('express');
const cors = require('cors');
const axios = require('axios');
const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

const port = process.env.PORT || 5000;
const BASE_URL = 'http://localhost:5000/api/contacts';

async function runApiTests() {
  console.log('--- API tests started ---');
  const summary = {
    create: false,
    read: false,
    update: false,
    delete: false,
    confirm: false,
  };

  let contactId = null;

  // 1. Create a contact
  try {
    console.log('Step 1: Create contact');
    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
    };

    const createRes = await axios.post(BASE_URL, payload);
    contactId = createRes.data._id;

    if (!contactId) {
      throw new Error('No id returned on create');
    }

    summary.create = true;
    console.log(`✅ created id=${contactId}, name=${createRes.data.name}`);
  } catch (err) {
    console.error('❌ create failed:', err.message || err);
  }

  // 2. Fetch all contacts
  let contactsList = [];
  try {
    console.log('Step 2: Fetch all contacts');
    const list = await axios.get(BASE_URL);
    contactsList = Array.isArray(list.data) ? list.data : [];
    summary.read = true;
    console.log(`✅ contacts fetched count=${contactsList.length}`);

    if (!contactId && contactsList.length > 0) {
      contactId = contactsList[0]._id;
      console.log(`ℹ fallback id set to ${contactId}`);
    }
  } catch (err) {
    console.error('❌ fetch failed:', err.message || err);
  }

  // 3. Update contact
  try {
    if (!contactId) throw new Error('No valid contact id to update');

    console.log('Step 3: Update contact', contactId);
    const updatePayload = { name: 'Updated Test User', email: 'updated@example.com', phone: '5554443333' };
    const update = await axios.put(`${BASE_URL}/${contactId}`, updatePayload);
    summary.update = true;
    console.log(`✅ updated id=${contactId}, name=${update.data.name}`);
  } catch (err) {
    console.error('❌ update failed:', err.message || err);
  }

  // 4. Delete contact
  try {
    if (!contactId) throw new Error('No valid contact id to delete');

    console.log('Step 4: Delete contact', contactId);
    await axios.delete(`${BASE_URL}/${contactId}`);
    summary.delete = true;
    console.log(`✅ deleted id=${contactId}`);
  } catch (err) {
    console.error('❌ delete failed:', err.message || err);
  }

  // 5. Confirm deletion
  try {
    console.log('Step 5: Confirm deletion');
    const listAfter = await axios.get(BASE_URL);
    const postDeleteList = Array.isArray(listAfter.data) ? listAfter.data : [];

    const isDeleted = !postDeleteList.some((item) => item._id === contactId);
    if (!isDeleted) {
      throw new Error('Contact still exists after delete');
    }

    summary.confirm = true;
    console.log(`✅ deletion confirmed, count now=${postDeleteList.length}`);
  } catch (err) {
    console.error('❌ confirm deletion failed:', err.message || err);
  }

  const allPassed = Object.values(summary).every(Boolean);
  console.log('--- API tests completed ---');
  console.log(`All API tests completed. ${allPassed ? 'All passed.' : 'Some steps failed.'}`);
}

connectDB()
  .then(() => {
    app.listen(port, async () => {
      console.log(`Server running on http://localhost:${port}`);

      if (process.env.NODE_ENV !== 'production') {
        console.log('Running API tests in development mode');
        try {
          await runApiTests();
        } catch (e) {
          console.error('Unexpected test runner error:', e.message || e);
        }
      }
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
