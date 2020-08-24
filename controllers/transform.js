const validate = require('joi')
const transformService = require('../services/transform')

const transform = {
    method: 'POST',
    path:'/transform',
    handler: (request, h) => {
      return transformService.transform(request.payload)
    },
    options: {
        validate: {
            payload: validate.object()
                .pattern(
                    /^[0-9]*$/,
                    validate.array()
                        .items(
                            validate.object({
                                id: validate.number().required(),
                                title: validate.string().required(),
                                level: validate.number().required(),
                                children: validate.array().length(0).required(),
                                parent_id: validate.number().allow(null)
                            }),
                        ),
                )
        },
        tags: ['api'],
    }
}

const allRoutes = [
    transform,
]

module.exports = {
    route: allRoutes,
}
