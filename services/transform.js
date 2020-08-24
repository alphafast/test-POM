const BoomError = require('@hapi/boom')

const transform = (source) => {

    const flattenComponents = (src) => {
        return Object.keys(src).reduce((components, key) => components.concat(src[key]), [])
    }

    const addComponentsNestedRelation = (components) => {
        const componentsMap = components.reduce((map, component) => map.set(component.id, component), new Map())
    
        componentsMap.forEach((val, key, map) => {
            const isChild = val.parent_id !== null
            if (isChild) {
                const parent = map.get(val.parent_id)
                parent.children.push(val)
            }
        })

        return Array.from(componentsMap.values())
    }

    const isCycle = (componentsWithRelation) => {
        const util = (componentWithRelation, visitedSet, recStackSet) => {
            if (recStackSet.has(componentWithRelation.id)) {
                return true
            }
            if (visitedSet.has(componentWithRelation.id)) {
                return false
            }

            visitedSet.add(componentWithRelation.id)
            recStackSet.add(componentWithRelation.id)

            const hasCycle = componentWithRelation.children.some(child => util(child, visitedSet, recStackSet))

            if (!hasCycle) {
                recStackSet.delete(componentWithRelation.id)
            }

            return hasCycle
        }

        const visited = new Set()
        const recStack = new Set()

        return componentsWithRelation.some(componentWithRelation => {
            return util(componentWithRelation, visited, recStack)
        })
    }

    return (() => {
        const componentsWithNestedRelation = addComponentsNestedRelation(flattenComponents(source))

        if (isCycle(componentsWithNestedRelation)) {
            throw new BoomError.badRequest('payload have cycle dependency')
        }

        return componentsWithNestedRelation.filter(l => l.parent_id === null)
    }) ()
}

module.exports = {
    transform
}
