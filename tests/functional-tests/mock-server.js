const { getInitSever } = require('../../app')

exports.initTestServer = async () => {
    const server = await getInitSever()
    await server.initialize()
    return server
}