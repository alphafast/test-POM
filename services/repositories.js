const WreckRequest = require('@hapi/wreck')
const BoomError = require('@hapi/boom')
const JoiValidate = require('joi')

const getDataRepositoriesPage = async (searchKeyword, page) => {
    const prePaginationCount = 5
    const recordPerPage = 10

    const data = await fetchRepositoriesData(searchKeyword, page, recordPerPage)
    const totalPage = Math.ceil(data.total_count / recordPerPage)
    const leftBound = page - Math.floor(prePaginationCount / 2)
    const safeLeftBound = leftBound < 1 ? 1 : leftBound > totalPage - (prePaginationCount - 1) ? totalPage - (prePaginationCount - 1) : leftBound

    return {
        repositories: data.items.map(item => {
            return {
                name: item.name,
                description: item.description,
                login: item.owner.login,
                avatar_url: item.owner.avatar_url,
                html_url: item.html_url,
            }
        }),
        pagination: {
            pageItems: new Array(prePaginationCount).fill(0).map((val, index) => {
                return {
                    isCurrentPage: safeLeftBound + index === page,
                    pageNumber: safeLeftBound + index,
                }
            }),
            previousButton: {
                isFirstPage: page <= 1,
                previousPageNumber: page - 1,
            },
            nextButton: {
                isLastPage: page >= totalPage,
                nextPageNumber: page + 1
            },
        }
    }
}

const fetchRepositoriesData = async (searchKeyword, page, recordPerPage) => {
    const { res, payload } = await WreckRequest.get(`https://api.github.com/search/repositories?q=${searchKeyword}&page=${page}&per_page=${recordPerPage}`, {
        headers: {
            'User-Agent': 'test',
            'Host': 'api.github.com'
        }
    })

    if (res.statusCode !== 200) {
        throw new BoomError.serverUnavailable(`error while fetch repositories from github.com status code: ${res.statusCode} message: ${res.statusMessage}`)
    }

    const response = JSON.parse(payload.toString())

    const validateResult = getGetGithubRepositoriesSchemaValidator().validate(response)
    if (validateResult.error !== undefined) {
        throw new BoomError.serverUnavailable(`service currently unavailable cause github search response not support: ${validateResult.error.details.map(errorItem => errorItem.message)}`)
    }

    return response
}

const getGetGithubRepositoriesSchemaValidator = () => {
    return JoiValidate.object({
        total_count: JoiValidate.number().required(),
        items: JoiValidate.array().items(JoiValidate.object({
            name: JoiValidate.string().required(),
            description: JoiValidate.string(),
            html_url: JoiValidate.string().uri().required(),
            owner: JoiValidate.object({
                login: JoiValidate.string().required(),
                avatar_url: JoiValidate.string().uri().required()
            }).required().unknown(true)
        }).unknown(true))
    }).unknown(true)
}

module.exports = {
    getDataRepositoriesPage,
}
