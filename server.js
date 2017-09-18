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
    { host: 'konpat.thddns.net', port: 3830 }
]

/**
 * START LISTENING
 */
net.createServer(
    forwardTo(OUTGOING)
).listen(INCOMING_PORT)

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
    /**
     * ping and dynamically change the target host here
     */
    const pings = OUTGOING.map(x => ping(x.host, x.port))
    return (conn) => {
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
                        console.log(`forwarding ${INCOMING_PORT} to ${host}:${port}`)

                        const proxy = net.createConnection({ host, port }, () => {
                            conn.pipe(proxy).pipe(conn)
                        })

                        break
                    }
                }
            })
    }
}
