import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const axiosI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 0,
  headers: { 'Content-Type': 'application/json' },
});

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_KEY,
  cluster: process.env.REACT_APP_PUSHER_CLUSTER,
  forceTLS: process.env.REACT_APP_PUSHER_USE_TLS,
  encrypted: process.env.REACT_APP_PUSHER_ENCRYPTED,  // change to true if the connection is encrypted using SSL
  // wsHost: window.location.hostname,
  // wsPort: 8000,
  // wssPort: 8000,
  disableStats: true,
  enabledTransports: ['ws', 'wss'], // Only WebSockets, not fallback options
});

function useChat(username) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axiosI.get('/messages', { params: { page } });
      const newMessages = response.data.data;

      if (page === 1) {
        setMessages(newMessages);
      } else {
        setMessages((prevMessages) => [...newMessages, ...prevMessages]);
      }

      setHasMore(page < response.data.last_page);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [page]);

  useEffect(() => {
    fetchMessages();

    window.Echo.channel('chat').listen('.MessageSent', (event) => {
      console.debug(`Message received from ${event.message.username}: ${JSON.stringify(event.message)}`);
      setMessages((prevMessages) => {
        const existingMessageIds = new Set(prevMessages.map((msg) => msg.id));
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
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadMoreMessages = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleMessageFormSubmit = (e) => {
    e.preventDefault();

    if (isSending) return;

    setMessage(message.trim());

    if (message === '') {
      return;
    }

    setIsSending(true);

    axiosI.post('/messages', { username, message })
      .then(() => {
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleKeyDown = (ev) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !isSending) {
      ev.preventDefault();
      // ev.stopPropagation();
      handleMessageFormSubmit(ev);
      return false;
    }
  };

  return {
    messages,
    hasMore,
    isSending,
    loadMoreMessages,
    handleMessageFormSubmit,
    message,
    setMessage,
    messagesEndRef,
    handleKeyDown,
  };
}

export default useChat;
