import React from 'react';

function MessageList({ messages, messagesEndRef, current_username }) {
  return (
    <>
      {/* Chat messages container */}
      {messages.map((msg, index) => (
        <div key={index} className={`chat ${msg.username === current_username ? 'chat-end' : 'chat-start'}`}>
          {msg.username !== current_username &&
            <div className="chat-header badge badge-primary badge-md p-2 rounded-bl-sm text-gray-100 bg-primary-500">
              <small><i>@</i></small>{msg.username}
            </div>
          }

          <div className={`chat-bubble whitespace-pre-line rounded-tl-sm ${msg.username === current_username ? 'chat-bubble-primary text-white' : ''}`}>
            { msg.message }

            <small className="fs-6 text-muted ml-2">
              <time className="text-xs opacity-50 ml-2">{
                new Date(msg.created_at)
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
