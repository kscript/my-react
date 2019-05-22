import { acorn, jsx, babel, generate } from "@/utils/babel";
const { Parser, Node } = acorn;
const { parse } = babel;

let rid = 1;
export const createElement =  (type: AnyObject & Function, config: AnyObject | null, children: any[]) => {
    console.log(type, config, children);
}

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
