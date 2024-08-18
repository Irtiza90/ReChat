import React from 'react';

function MessageForm({ message, setMessage, handleMessageFormSubmit, handleKeyDown, isSending }) {
  return (
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
  );
}

export default MessageForm;
