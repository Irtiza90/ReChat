import React from 'react';
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import ChatInterface from './ChatInterface';

function ChatWindow({ username }) {
  const {
    messages,
    hasMore,
    isSending,
    loadMoreMessages,
    handleMessageFormSubmit,
    message,
    setMessage,
    messagesEndRef,
    handleKeyDown,

  } = ChatInterface(username);

  return (
    <div>
      <button onClick={loadMoreMessages} disabled={!hasMore || isSending}>
        Load More
      </button>

      <MessageList messages={messages} messagesEndRef={messagesEndRef} />

      <MessageForm
        message={message}
        setMessage={setMessage}
        handleMessageFormSubmit={handleMessageFormSubmit}
        handleKeyDown={handleKeyDown}
        isSending={isSending}
      />
    </div>
  );
}

export default ChatWindow;
