import watchMinecraftServers from './index.js'

let close = watchMinecraftServers((host, port, name, obj) => {
    console.log(`new minecraft server at ${host}:${port} - "${name}"`, obj)
    /*  uncomment this to print one server and exit
    close()
    process.exit()
    */
})

setTimeout(process.exit, 10 * 1000)