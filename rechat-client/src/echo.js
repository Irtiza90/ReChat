import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const envConfig = {
  'PUSHER_APP_KEY': '38be918a5a51616fda91',
  'PUSHER_APP_CLUSTER': 'ap2',
  'PUSHER_USE_TLS': true,
};

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: envConfig.PUSHER_APP_KEY,
  cluster: envConfig.PUSHER_APP_CLUSTER,
  forceTLS: envConfig.PUSHER_USE_TLS,
  encrypted: false,  // change to true if the connection is encrypted using SSL
  // wsHost: window.location.hostname,
  // wsPort: 8000,
  // wssPort: 8000,
  disableStats: true,
  enabledTransports: ['ws', 'wss'], // Only WebSockets, not fallback options
});

export default Echo;
