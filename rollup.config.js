import typescript from "rollup-plugin-typescript";
import babel from "rollup-plugin-babel";
export default {
    input: 'src/index.js',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    },
    plugins: [
        typescript({
            "target": "es5",
            "sourceMap": false
        }),
        babel()
    ]
};
