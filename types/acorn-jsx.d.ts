
declare module 'acornJsx' {
    // import * as jsx from 'acorn-jsx'; 
    interface Option {
        preserveParens?: boolean;
        allowNamespacedObjects?: boolean;
    }
    // export = jsx;
    export = _default;
    function _default(option: Option): any;
}
