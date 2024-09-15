import './App.css';
import { useEffect, useState } from 'react';
import { Button, EditableText, InputGroup, Toaster } from '@blueprintjs/core';

const toaster = Toaster.create({
  position:'bottom-left',
});

function App() {
  
  const [users, setUsers] = useState([]);


  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((jsondata) => setUsers(jsondata));
  }, []);

  const [newname, setnewname] = useState('');
  const [newemail, setnewemail] = useState('');
  const [newwebsite, setnewwebsite] = useState('');

  function addUser() {
    const name = newname.trim();
    const email = newemail.trim();
    const website = newwebsite.trim();

    if (name && email && website) {
      fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
      })
        .then((response) => response.json())
        .then((jsondata) => {
          setUsers([...users, jsondata]);
          toaster.show({
            message: 'User added successfully',
            intent: 'success',
            timeout: 3000,
          });
          setnewemail('');
          setnewname('');
          setnewwebsite('');
        });
    }
  }

  function onChangeHandler(id, key, value) {
    setUsers((users) => {
      return users.map((user) => {
        return user.id === id ? { ...user, [key]: value } : user;
      });
    });
  }

  function updateUser(id) {
    const user = users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        toaster.show({
          message: 'User updated successfully',
          intent: 'success',
          timeout: 3000,
        });
        setnewemail('');
        setnewname('');
        setnewwebsite('');
      });
  }

  function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then(() => {
        setUsers((users) => users.filter((user) => user.id !== id));

        toaster.show({
          message: `User ${id} deleted successfully`,
          intent: 'success',
          timeout: 3000,
        });
        setnewemail('');
        setnewname('');
        setnewwebsite('');
      });
  }

  return (
    <div className="App">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText
                  onChange={(value) => onChangeHandler(user.id, 'email', value)}
                  value={user.email}
                />
              </td>
              <td>
                <EditableText
                  onChange={(value) => onChangeHandler(user.id, 'website', value)}
                  value={user.website}
                />
              </td>
              <td>
                <Button
                  style={{ padding: '4px', margin: '3px' }}
                  intent="primary"
                  onClick={() => updateUser(user.id)}
                >
                  Update
                </Button>
                <Button
                  style={{ padding: '4px', margin: '3px' }}
                  intent="danger"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                value={newname}
                onChange={(e) => setnewname(e.target.value)}
                placeholder="Enter name..."
              />
            </td>
            <td>
              <InputGroup
                value={newemail}
                onChange={(e) => setnewemail(e.target.value)}
                placeholder="Enter email..."
              />
            </td>
            <td>
              <InputGroup
                value={newwebsite}
                onChange={(e) => setnewwebsite(e.target.value)}
                placeholder="Enter website..."
              />
            </td>
            <td>
              <Button intent="success" onClick={addUser}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
