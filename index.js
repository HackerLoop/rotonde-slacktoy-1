'use strict';

const client = require('rotonde-client/node/rotonde-client')('ws://rotonde:4224');

const port = '/dev/tty.usbmodem1421';

client.onReady(() => {
  console.log('connected');

  client.bootstrap({
  'SERIAL_CLOSE': {
    port,
  }, 'SERIAL_OPEN': {
    port,
    baud: 19200,
  }}, ['SERIAL_STATUS'], []).then((e) => {
    if (e[0].data.status != 'SUCCESS') {
      console.log('Open failed');
      process.exit(1);
    }

    client.addLocalDefinition('action', 'SLACKTOY_1_MOVE', [
      {
        'name': 'x',
        'type': 'number',
        'units': '0-180',
      },
      {
        'name': 'y',
        'type': 'number',
        'units': '0-180',
      },
    ]);

    client.actionHandlers.attach('SLACKTOY_1_MOVE', (a) => {
      console.log(a.data);
      client.sendAction('SERIAL_WRITE', {
        port,
        data: new Buffer(parseInt(a.data.x) + 'x').toString('base64'),
      });
      client.sendAction('SERIAL_WRITE', {
        port,
        data: new Buffer(parseInt(a.data.y) + 'y').toString('base64'),
      });
    });
  });
});

client.connect();
