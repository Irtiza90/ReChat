import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

import './echo';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1); // current page
  const [hasMore, setHasMore] = useState(true); // if there are more messages to load

  const messagesEndRef = useRef(null); // Ref for the messages container

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
  }, [page]); // `page` to dependency

  useEffect(() => {
    fetchMessages();

    window.Echo.channel('chat')
      .listen('\\App\\Events\\MessageSent', (event) => {
        console.debug(`Message received from ${event.message.username}: ${JSON.stringify(event.message)}`);
        // setMessages(prevMessages => [...prevMessages.slice(-99), event.message]);

        setMessages(prevMessages => {
          // a Set of existing message IDs for quick lookup
          const existingMessageIds = new Set(prevMessages.map(msg => msg.id));
          // check if the incoming message is already in the state
          if (!existingMessageIds.has(event.message.id)) {
            // append new messages to end and trim to max 100 messages
            return [...prevMessages.slice(-99), event.message];
          }

          return prevMessages;
        });
      });

    return () => {
      // cleanup
      // channel.unbind_all();
      // channel.unsubscribe();
    };
  }, [page, fetchMessages]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
      <div style={{ minHeight: '500px', maxHeight: '500px', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}

        {/* Scroll target */}
        <div ref={messagesEndRef} />
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
