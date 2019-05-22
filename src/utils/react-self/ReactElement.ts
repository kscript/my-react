export const hasValidRef = (config: AnyObject) => {
    if (Object.hasOwnProperty.call(config, 'ref')) {
        const getter: any = Object.getOwnPropertyDescriptor(config, 'ref');
        if (getter.get && getter.get.isReactWarning) {
            return false;
        }
    }
    return config.ref !== undefined;
}
export const hasValidKey = (config: AnyObject) => {
    if (Object.hasOwnProperty.call(config, 'key')) {
        const getter: any = Object.getOwnPropertyDescriptor(config, 'key');
        if (getter.get && getter.get.isReactWarning) {
            return false;
        }
    }
    return config.key !== undefined;
}
export default {
    hasValidRef,
    hasValidKey
}
