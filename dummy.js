const net = require('net')

/**
 * Test if the server.js forwards to a specified port
 */

net.createServer((conn) => {
    conn.on('data', (buf) => {
        console.log('buf:', buf)
    })
}).listen('4001')
