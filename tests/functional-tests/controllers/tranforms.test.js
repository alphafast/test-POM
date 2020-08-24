const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script()
const { initTestServer } = require('../mock-server')
const { mockCaseSuccess, mockCaseFailWhenCallWithNotAcceptPayload } = require('./tranforms.data')

describe('SERVER/transform/', () => {
    let server

    beforeEach(async () => {
        server = await initTestServer()
    })

    afterEach(async () => {
        await server.stop()
    })

    describe('POST: /transform', () => {
        it('should success when call transform', async () => {
            const res = await server.inject({
                method: 'post',
                url: '/transform',
                payload: mockCaseSuccess.input,
            })
            expect(res.statusCode).to.equal(200)
            expect(res.payload).to.equal(JSON.stringify(mockCaseSuccess.expected))
        })

        it('should fail when call transform with invalid payload', async () => {
            const res = await server.inject({
                method: 'post',
                url: '/transform',
                payload: mockCaseFailWhenCallWithNotAcceptPayload.input,
            })
            expect(res.statusCode).to.equal(400)
            expect(res.payload).to.contain(mockCaseFailWhenCallWithNotAcceptPayload.expected.errorMessage)
        })
    })
})
