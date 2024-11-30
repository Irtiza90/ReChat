import React, { useState } from 'react';
import Login from './Login';
import ChatWindow from './ChatWindow';

function Chat() {
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setUsername(username); // set username on login
    console.debug("Logged in as: " + username);
  };

  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  return <ChatWindow username={username} />;
}

export default Chat;
