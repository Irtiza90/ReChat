import React from 'react';

function MessageForm({ message, setMessage, handleMessageFormSubmit, handleKeyDown, isSending }) {
  return (
    <form onSubmit={handleMessageFormSubmit}>
      <div className="p-3 bg-base-300 flex items-center space-x-2 h-28">
        {/* Input area */}
        <textarea
          required
          autoFocus={true}
          className="textarea textarea-bordered flex-1 resize-none"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleKeyDown}
          disabled={isSending} // disable if message is in progress
        />

        <button type="submit" className="btn btn-primary align-bottom h-3/6" disabled={isSending}>
          {isSending
            ? <span className="loading loading-spinner loading-md"></span>
            : 'Send'
          }
        </button>
      </div>
    </form>
  );
}

export default MessageForm;
