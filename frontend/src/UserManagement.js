import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null); // Track user being edited

  // Fetch users when the component loads
  useEffect(() => {
    axios.get('http://localhost:5001/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Create a new user
  const createUser = () => {
    if (name && email) {
      axios.post('http://localhost:5001/api/users', { name, email })
        .then(response => {
          setUsers([...users, response.data]);
          setName('');  // Clear input field
          setEmail(''); // Clear input field
        })
        .catch(error => {
          console.error('Error creating user:', error);
        });
    }
  };

  // Update an existing user
  const updateUser = () => {
    if (editingUser && name && email) {
      axios.put(`http://localhost:5001/api/users/${editingUser.id}`, { name, email })
        .then(response => {
          const updatedUsers = users.map(user =>
            user.id === editingUser.id ? response.data : user
          );
          setUsers(updatedUsers);
          setName('');
          setEmail('');
          setEditingUser(null);
        })
        .catch(error => {
          console.error('Error updating user:', error);
        });
    }
  };

  // Delete a user
  const deleteUser = (id) => {
    axios.delete(`http://localhost:5001/api/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      });
  };

  // Set user for editing
  const startEditing = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>User Management</Typography>
      <Card variant="outlined" style={{ marginBottom: '20px' }}>
        <CardContent>
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <Button
            variant="contained"
            color={editingUser ? "secondary" : "primary"}
            onClick={editingUser ? updateUser : createUser}
          >
            {editingUser ? "Update User" : "Create User"}
          </Button>
        </CardContent>
      </Card>
      <div>
        {users.map(user => (
          <Card key={user.id} variant="outlined" style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography variant="h6">{user.name}</Typography>
              <Typography variant="body2">{user.email}</Typography>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: '10px' }}
                onClick={() => startEditing(user)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
