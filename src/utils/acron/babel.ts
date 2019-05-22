import * as Babel from '@babel/parser';
import * as Acorn from 'acorn';
// / @ts-ignore 
import Generate from '@babel/generator';
/// @ts-ignore 
// https://github.com/Microsoft/TypeScript/pull/19675
import * as Jsx from 'acorn-jsx';

export const acorn = Acorn;
export const babel = Babel;
export const jsx = Jsx;
export const generate = Generate;
export default {
    acorn,
    jsx,
    babel,
    generate,
};
