import React from 'react';

function MessageList({ messages, messagesEndRef, current_username }) {
  return (
    <>
      {/* Chat messages container */}
      {messages.map((msg, index) => (
        <div key={index} className={`chat ${msg.user.from === current_username ? 'chat-end' : 'chat-start'}`}>
          {msg.user.from !== current_username &&
            <div className="p-2 text-gray-100 rounded-bl-sm chat-header badge badge-primary badge-md bg-primary-500">
              <small><i>@</i></small>{msg.user.from}
            </div>
          }

          <div className={`chat-bubble whitespace-pre-line rounded-tl-sm ${msg.user.from === current_username ? 'chat-bubble-primary text-white' : ''}`}>
            { msg.message }

            <small className="ml-2 fs-6 text-muted">
              <time className="ml-2 text-xs opacity-50">{
                new Date(msg.timestamp)
                  .toLocaleTimeString('en-GB', { hour12: false })
              }</time>
            </small>
          </div>
        </div>
      ))}

      {/* Scroll target */}
      <div ref={messagesEndRef} />
    </>
  );
}

export default MessageList;
