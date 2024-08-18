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
    <div className="flex flex-col h-screen mx-auto rounded-lg shadow-lg w-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-200" style={{ background: 'linear-gradient(45deg, black, transparent)' }}>
        {messages.length > 0 && (
          <button onClick={loadMoreMessages} className={`btn btn-outline mx-auto ${(hasMore ? '' : 'hidden')}`}>
            Load More
          </button>
        )}

        <MessageList current_username={username} messages={messages} messagesEndRef={messagesEndRef} />
      </div>

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
