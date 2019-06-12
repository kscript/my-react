export const isEmpty = (obj: AnyObject) => {
    if (obj instanceof Object) {
        for(let i in obj) {
            if (obj.hasOwnProperty(i)){
                return false
            }
        }
    }
    return true
}
export const getType = (data: any) => {
    let type = typeof data;
    if(type === 'object') {
        return Object.prototype.toString.call(data).slice(8, -1);
    }
    return type;
}
export const execFunc = (instance: AnyObject, key: string) => {
    if (instance[key] && getType(instance[key]) === 'function' ) {
        return instance[key].bind(instance)
    }
    return () => {}
}
export default {
    getType,
    execFunc,
    isEmpty,
}
