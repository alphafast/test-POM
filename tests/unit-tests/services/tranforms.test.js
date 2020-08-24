const Lab = require('@hapi/lab')
const { expect } = require('@hapi/code')
const { describe, it } = exports.lab = Lab.script()

const { transform } = require('../../../services/transform')

const { mockCaseSuccess, mockCaseFailCycleDependency } = require('./tranforms.data')

describe('transform service', () => {
    it('should success when call transform', () => {
        const result = transform(mockCaseSuccess.input)

        expect(result).to.equals(mockCaseSuccess.expected)
    })

    it('should fail when input have cycle dependency', () => {
        expect(() => transform(mockCaseFailCycleDependency.input)).to.throws(mockCaseFailCycleDependency.expected.errorMessage)
    })
})
