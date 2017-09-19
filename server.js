const net = require('net')

/**
 * CONFIG LISTENING PORT
 */
const INCOMING_PORT = 2022
/**
 * CONFIG THE HOSTS
 */
const OUTGOING = [
    { host: '192.168.1.100', port: 22 },
    { host: 'myhost.ddns.net', port: 2222 }
]

/**
 * keep state
 */
const state = {
    lastHost: { host: null, port: null }
}

/**
 * START LISTENING
 */
net.createServer(
    forwardTo(OUTGOING)
)
    .listen(INCOMING_PORT)
    .on('error', err => {
        if (err.errno == 'EADDRINUSE') {
            console.error(`cannot bind the ${INCOMING_PORT} port`)
        } else {
            console.error('error while creating server:', err.errno, 'message:', err.message)
        }
    })

function ping(host, port, timeout = 500) {
    return new Promise((res, rej) => {
        const c = net.connect({ host, port, timeout }, () => {
            res(true)
            c.end()
        })
            .on('timeout', () => {
                res(false)
            })
            .on('error', err => {
                res(false)
            })
    })
}

function forwardTo(list) {
    return (conn) => {
        /**
         * ping and dynamically change the target host here
         */
        const pings = OUTGOING.map(x => ping(x.host, x.port))
        /**
         * wait until the host is determined
         */
        Promise.all(pings)
            .then(pings => {
                for (let i = 0; i < ping.length; ++i) {
                    const out = OUTGOING[i]
                    const okay = pings[i]
                    if (okay) {
                        const host = out.host
                        const port = out.port

                        if (host != state.lastHost.host
                            || port != state.lastHost.port) {
                            console.log(`forwarding ${INCOMING_PORT} to ${host}:${port}`)
                        }

                        state.lastHost = { host, port }

                        /**
                         * forward the packets
                         */
                        const proxy = net.createConnection({ host, port }, () => {
                            conn.pipe(proxy).pipe(conn)
                        })
                            .on('error', err => {
                                /**
                                 * clear state
                                 */
                                state.lastHost = { host: null, port: null }
                                if (err.errno == 'ECONNRESET') {
                                    console.error('connection reset ... check the internet connection')
                                } else {
                                    console.error('error while forwarding:', err.errno, 'message:', err.message)
                                }
                            })

                        return
                    }
                }

                /**
                 * no host
                 */
                console.error('no host reachable!')
                conn.end()
            })
    }
}
