const { getDataRepositoriesPage } = require('../services/repositories')

const repositories = {
    method: 'GET',
    path:'/repositories',
    handler: async (request, reply) => {
        const page = request.query.page || '1'
        const payload = await getDataRepositoriesPage('nodejs', parseInt(page))
        return reply.view('index.html', payload)
    },
    options: {
        tags: ['api'],
    }
}

const allRoutes = [
    repositories
]

module.exports = {
    route: allRoutes,
}
