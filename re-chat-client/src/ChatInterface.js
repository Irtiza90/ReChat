import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const axiosI = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 0,
  headers: { 'Content-Type': 'application/json' },
});

function useChat(username) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);

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

    // Connect to WebSocket server
    ws.current = new WebSocket(`ws://localhost:8000/ws/${username}`);

    ws.current.onmessage = (event) => {
      console.debug(`Message received: ${event.data}`);
      const response = JSON.parse(event.data);
      const data = response.data;
      setMessages((prevMessages) => {
        const existingMessageIds = new Set(prevMessages.map((msg) => msg.id));
        if (!existingMessageIds.has(data.id)) {
          return [...prevMessages.slice(-99), data];
        }
        return prevMessages;
      });
    };

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [fetchMessages, username]);

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

    let _message = message.trim();

    setMessage(_message);

    if (_message === '') {
      return;
    }

    if (ws.current) {
      setIsSending(true);

      ws.current.send(message);
      setMessage('');

      setIsSending(false);
    }
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
