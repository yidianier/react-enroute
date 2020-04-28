import {cloneElement, Children} from 'react'
import {findPathValue} from './utils'


export {genLocation, loc, isPath, findPath, findPathValue} from './utils'

export function Router({
  location,
  options,
  children,
}) {
  if (!location) return null

  const routes = addRoutes(children)
  return renderMatch(routes, location, options)
}

function addRoutes(elements, parent, routes = {}) {
  Children.forEach(elements, element => {
    const route = createRoute(element, parent)
    routes[route.path] = route

    const {children} = element.props
    addRoutes(children, route, routes)
  })

  return routes
}

function createRoute(element, parent) {
  const path = fullPath(element.props.path, parent)
    .replace(/\/$/, '') // remove last slash

  return {path, parent, element}
}

function fullPath(path, parent) {
  if (!path) return parent ? parent.path : '' // index route
  if (!parent || path[0] === '/') return path // absolute or root
  return parent.path + '/' + path
}

function renderMatch(routes, location, options) {
  const result = findPathValue(routes, location, options)
  if (!result) return null

  return render(result.value, result.params)
}

function render(route, params, children) {
  const {element, parent} = route
  const node = cloneElement(element, params, children)

  return parent ? render(parent, params, node) : node
}
