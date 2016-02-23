'use strict';

const client = require('rotonde-client/node/rotonde-client')('ws://rotonde:4224');

let angle = 0;
const startCos = () => {
  client.sendAction('SLACKTOY_1_MOVE', {
    x: Math.cos(angle) * 180,
    y: Math.sin(angle) * 180,
  });
  angle += Math.PI / 50;
  console.log(angle);
};

client.onReady(() => {
  client.bootstrap({}, [], ['SLACKTOY_1_MOVE']).then(() => {
    setInterval(startCos, 50);
  });
});

client.connect();
