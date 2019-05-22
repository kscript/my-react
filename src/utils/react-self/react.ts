import { hasValidRef, hasValidKey } from "@/utils/react-self/ReactElement";
import { acorn, jsx, babel, generate } from "@/utils/acron/babel";
import ReactCurrentOwner from './ReactCurrentOwner';
const { Parser, Node } = acorn;
const { parse } = babel;
const hasSymbol = typeof Symbol === 'function' && Symbol.for;

const REACT_ELEMENT_TYPE = hasSymbol
    ? Symbol.for('react.element')
    : 0xeac7;
const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true,
};
let specialPropKeyWarningShown: boolean, specialPropRefWarningShown: Boolean;
let __DEV__ = true;
let rid = 1;
export const createElement =  (type: AnyObject & Function, config: AnyObject | null, children: any[]) => {
    let propName;
    let props: AnyObject = {};
    let key = null;
    let ref = null;
    let self = null;
    let source = null;
    if (config != null) {
        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey(config)) {
            key = '' + config.key;
        }
        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        for (propName in config) {
            if (Object.hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
                props[propName] = config[propName];
            }
        }
    }
    let childArray = [];
    for (let i = 0; i < children.length; i++) {
        childArray[i] = children[i];
    }
    if ("development" !== process.env.mode) {
        if (Object.freeze) {
            Object.freeze(childArray);
        }
    }
    props.children = childArray;
    if (type && type.defaultProps) {
        let defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }
    if ("development" !== process.env.mode) {
        if (key || ref) {
            if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
                let displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
                if (key) {
                    defineKeyPropWarningGetter(props, displayName);
                }
                if (ref) {
                    defineRefPropWarningGetter(props, displayName);
                }
            }
        }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
export const defineKeyPropWarningGetter = (props: AnyObject, displayName: string) => {
    const warnAboutAccessingKey = () => {
        if (!specialPropKeyWarningShown) {
            specialPropKeyWarningShown = true;
            console.log('%s: `key` is not a prop. Trying to access it will result ' +
            'in `undefined` being returned. If you need to access the same ' +
            'value within the child component, you should pass it as a different ' +
            'prop. (https://fb.me/react-special-props)',displayName)
            // warningWithoutStack(
            //   false,
            //   '%s: `key` is not a prop. Trying to access it will result ' +
            //     'in `undefined` being returned. If you need to access the same ' +
            //     'value within the child component, you should pass it as a different ' +
            //     'prop. (https://fb.me/react-special-props)',
            //   displayName,
            // );
        }
    };
    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
        get: warnAboutAccessingKey,
        configurable: true,
    });
}
export const defineRefPropWarningGetter = (props: AnyObject, displayName: string) => {
    const warnAboutAccessingRef = () => {
        if (!specialPropRefWarningShown) {
            specialPropRefWarningShown = true;
            console.log(displayName)
            // warningWithoutStack(
            //   false,
            //   '%s: `ref` is not a prop. Trying to access it will result ' +
            //     'in `undefined` being returned. If you need to access the same ' +
            //     'value within the child component, you should pass it as a different ' +
            //     'prop. (https://fb.me/react-special-props)',
            //   displayName,
            // );
        }
    };
    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
        get: warnAboutAccessingRef,
        configurable: true,
    });
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */
export const ReactElement = (type: AnyObject, key: string | null, ref: string | null, self: AnyObject, source: string, owner: AnyObject, props: AnyObject) => {
    const element: AnyObject = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,

        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,

        // Record the component responsible for creating this element.
        _owner: owner,
    };

    if (__DEV__) {
        // The validation flag is currently mutative. We put it on
        // an external backing store so that we can freeze the whole object.
        // This can be replaced with a WeakMap once they are implemented in
        // commonly used development environments.
        element._store = {};

        // To make comparing ReactElements easier for testing purposes, we make
        // the validation flag non-enumerable (where possible, which should
        // include every environment we run tests in), so the test framework
        // ignores it.
        Object.defineProperty(element._store, 'validated', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false,
        });
        // self and source are DEV only properties.
        Object.defineProperty(element, '_self', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self,
        });
        // Two elements created in two different places should be considered
        // equal for testing purposes and therefore we hide it from enumeration.
        Object.defineProperty(element, '_source', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source,
        });
        if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
        }
    }

    return element;
};

export class Component {
    private state: AnyObject = {};
    private rid: number = 1;
    constructor() {
        this.rid = rid++;
    }
    public setState(set: any): void {
        if (typeof set !== 'function') {
            for (const key of Object.keys(set)) {
                this.state[key] = set[key];
            }
        }
    }
}
export const React: AnyObject = {
    Component,
    createElement
};
export default React;
