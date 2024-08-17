import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [message, setMessage]   = useState('');

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages');
      console.debug(response.data);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();

    // NOTE: setting pusher to const causes websocket connectivity issues
    var pusher = new Pusher('38be918a5a51616fda91', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('chat');
    channel.bind('App\\Events\\MessageSent', function(data) {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/api/messages', {
        username,
        message,
      });

      setMessage(''); // clear the message input

      await fetchMessages();

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
