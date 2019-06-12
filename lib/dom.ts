export const removeChild = (node: HTMLElement) => {
    node && node.parentNode && node.parentNode.removeChild(node)
}
export default {
    removeChild
}
