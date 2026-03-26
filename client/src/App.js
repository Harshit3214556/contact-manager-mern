import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/contacts';

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const loadContacts = async () => {
    try {
      const res = await axios.get(API_URL);
      setContacts(res.data);
    } catch (e) {
      setError('Could not load contacts');
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const addContact = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const payload = { name: name.trim(), email: email.trim(), phone: phone.trim() };

    try {
      const res = await axios.post(API_URL, payload);
      setContacts((prev) => [res.data, ...prev]);
      setName('');
      setEmail('');
      setPhone('');
    } catch (e) {
      setError('Could not add contact');
    }
  };

  const removeContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setContacts((prev) => prev.filter((item) => item._id !== id));
    } catch (e) {
      setError('Could not delete contact');
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Contact Manager</h1>

      <form onSubmit={addContact} style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 8 }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (required)"
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 8 }}>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>
          Add
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {contacts.length === 0 ? (
        <p>No contacts yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {contacts.map((contact) => (
            <li key={contact._id} style={{ borderBottom: '1px solid #ddd', padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{contact.name}</strong>
                  <div>{contact.email || 'No email'}</div>
                  <div>{contact.phone || 'No phone'}</div>
                </div>
                <button onClick={() => removeContact(contact._id)} style={{ marginLeft: 12 }}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
