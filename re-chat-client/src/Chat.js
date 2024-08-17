import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1); // current page
  const [hasMore, setHasMore] = useState(true); // if there are more messages to load

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages', {
        params: { page }
      });

      const newMessages = response.data.data;

      if (page === 1) {
        setMessages(newMessages);
      } else {
        // prepend older messages if not on the first page
        setMessages(prevMessages => [...newMessages, ...prevMessages]);
      }

      setHasMore(page < response.data.last_page);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [page]); // Add `page` to dependency array

  useEffect(() => {
    fetchMessages();

    var pusher = new Pusher('38be918a5a51616fda91', {
      cluster: 'ap2',
    });

    const channel = pusher.subscribe('chat');
    channel.bind('App\\Events\\MessageSent', function(data) {
      setMessages(prevMessages => [data.message, ...prevMessages.slice(0, 99)]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [page, fetchMessages]); // Add fetchMessages here

  const loadMoreMessages = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

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
      <button onClick={loadMoreMessages} disabled={!hasMore}>
        Load More
      </button>
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
