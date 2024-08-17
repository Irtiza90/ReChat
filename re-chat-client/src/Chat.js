import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Login from './Login'; // Import the Login component
import './echo';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState(''); // Username state
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1); // current page for pagination
  const [hasMore, setHasMore] = useState(true); // if there are more messages to load
  const [isSending, setIsSending] = useState(false); // track message sending state
  const messagesEndRef = useRef(null); // ref for the messages container

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
  }, [page]); // `page` dependency

  useEffect(() => {
    fetchMessages();

    window.Echo.channel('chat')
      .listen('\\App\\Events\\MessageSent', (event) => {
        console.debug(`Message received from ${event.message.username}: ${JSON.stringify(event.message)}`);
        setMessages(prevMessages => {
          const existingMessageIds = new Set(prevMessages.map(msg => msg.id));
          if (!existingMessageIds.has(event.message.id)) {
            return [...prevMessages.slice(-99), event.message];
          }
          return prevMessages;
        });
      });

    return () => {
      // cleanup listeners
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

  const handleMessageFormSubmit = async (e) => {
    e.preventDefault();

    // don't send a new message if a message is already in progress
    if (isSending) return;

    // disable form during submission
    setIsSending(true);

    try {
      await axios.post('http://localhost:8000/api/messages', {
        username,
        message,
      });

      setMessage(''); // Clear the message input
      await fetchMessages();

    } catch (error) {
      console.error('Error sending message:', error);

    } finally {
      // re-enable message sending
      setIsSending(false);
    }
  };

  const handleLogin = (username) => {
    setUsername(username); // Set username on login
    console.debug("Logged in as: " + username);
  };

  // If username is not set, show the login form
  if (!username) {
    return <Login onLogin={handleLogin} />;
  }

  const handleKeyDown = (ev) => {
    if(ev.key === 'Enter' && !ev.shiftKey && !isSending) {
      ev.preventDefault();
      handleMessageFormSubmit(ev);
    }
  }

  // Render chat interface if logged in
  return (
    <div>
      <button onClick={loadMoreMessages} disabled={!hasMore || isSending}>
        Load More
      </button>

      <div style={{ minHeight: '80svh', maxHeight: '80svh', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div key={index}>
            <small>{
              new Date(msg.created_at).toLocaleTimeString('en-GB', { hour12: false })
            }</small> :: <small>@</small><strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}

        {/* Scroll target */}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleMessageFormSubmit}>
        <textarea
          required
          value={message}
          placeholder="Enter your message"
          style={{ width: '400px', height: '50px', marginTop: '5px' }}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleKeyDown}
          disabled={isSending} // disable if message is in progress
        ></textarea>

        <button type="submit" disabled={isSending}>Send</button>
      </form>
    </div>
  );
}

export default Chat;
