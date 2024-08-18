import React from 'react';

function MessageList({ messages, messagesEndRef }) {
  return (
    <div style={{ minHeight: '80svh', maxHeight: '80svh', overflowY: 'scroll' }}>
      {messages.map((msg, index) => (
        <div key={index}>
          <small>
            {
              new Date(msg.created_at)
                .toLocaleTimeString('en-GB', { hour12: false })
            }
          </small>{' '}
          :: <small>@</small>
          <strong>
            <i>{msg.username}</i>
          </strong>
          : {msg.message}
        </div>
      ))}

      {/* Scroll target */}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
