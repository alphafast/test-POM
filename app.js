const hapi = require('@hapi/hapi')
const vision = require('@hapi/vision')
const inert = require('@hapi/inert')
const hapiSwagger = require('hapi-swagger')
const path = require('path')

const transformRoute = require('./controllers/transform')
const resourceRoute = require('./controllers/resource')
const repositoryRoute = require('./controllers/repositories')

const getInitSever = async () => {
    const initialServer = hapi.server({
        port: 2999,
        host: 'localhost',
        routes: {
            files: {
                relativeTo: path.join(__dirname, 'public')
            }
        }
    })

    await initialServer.register(vision)
    await initialServer.register(inert)
    await initialServer.register({
        plugin: hapiSwagger,
        options: {
            info: {
                title: 'API Documentation',
                version: '1.0.0',
            },
        }
    })

    initialServer.route([
        ...transformRoute.route,
        ...resourceRoute.route,
        ...repositoryRoute.route,
    ])

    initialServer.views({
        path: 'templates',
        engines: {
            html: require('handlebars'),
        },
        partialsPath: './templates/with-components',
        helpersPath: './templates/helpers',
        isCached: false
    })

    return initialServer
}

const startServer = async () => {
    const server = await getInitSever()
    await server.start()

    console.log(`Server started on port 2999`)
}

startServer()
    .catch(error => {
        console.error(error.message, error)
    })

module.exports = {
    getInitSever,
}
