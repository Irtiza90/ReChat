import React, { useState } from 'react';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div className="login-container w-11/12 sm:w-2/6 m-auto py-40">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label className="input input-bordered input-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70"> <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>

          <input
            required
            type="text"
            className="grow"
            autoFocus={true}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your username"
          />
        </label>

        <button className="btn btn-primary mt-6 w-1/4 m-auto" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
