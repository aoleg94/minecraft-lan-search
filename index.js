import { createSocket } from 'dgram';

export default function watchMinecraftServers(cb) {
    let server = createSocket('udp4')
    server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`)
        server.close()
    })
    const seen = {}
    const timeout = 10
    server.on('message', (msg, rinfo) => {
        const str = msg.toString('utf8')
        const re = /\[(\w+)\](.*)\[\/\1\]/gy
        const obj = {}
        for(let x = re.exec(str); x; x = re.exec(str))
        {
            obj[x[1]] = x[2]
        }
        const name = obj.MOTD
        const port = +obj.AD
        const host = rinfo.address
        if(port <= 0 || port >= 65536)
            return
        const key = host + port + name
        const now = Date.now()
        const last = seen[key] || 0
        seen[key] = now
        if(now - last < timeout * 1000)
            return
        cb(host, port, name, obj)
    })
    server.bind(4445, () => {
        server.addMembership('224.0.2.60')
    })
    return function stop() {
        if(server) {
            server.close()
            server = null
        }
    }
}

