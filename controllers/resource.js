const resource = {
    method: 'GET',
    path: '/resource/{param*}',
    handler: {
        directory: {
            path: '.',
            redirectToSlash: true,
            index: true,
        }
    }
}

const allRoutes = [
    resource
]

module.exports = {
    route: allRoutes,
}