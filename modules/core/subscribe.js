'use strict';

// Save the connected socket to the subscribers under the channel with the key of client
const subscribe = function(channel, payload, channels, cb) {
  let nch = channels;

  if (payload.privateKey && !nch[channel]) {
    nch[channel] = {
      privateKey: payload.privateKey,
      subscribers: {}
    };
  } else if (!nch[channel]) {
    nch[channel] = {
      subscribers: {}
    };
  }


  if (nch[channel].privateKey) {
    if (payload.privateKey === nch[channel].privateKey) {
      nch[channel].subscribers[payload.client] = {
        online: true,
        status: 'active',
        socket: payload.socket
      };

      cb(nch);
    }
  } else {
    nch[channel].subscribers[payload.client] = {
      online: true,
      status: 'active',
      socket: payload.socket
    };

    cb(nch);
  }

  // TODO: make this actually remove the subscriber when the connection is terminated.
  payload.socket.onclose(() => {
    nch[channel].subscribers[payload.client].online = false;
    nch[channel].subscribers[payload.client].online = 'offline';
    cb(nch);
  });
};

module.exports = subscribe;