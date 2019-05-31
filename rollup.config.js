import typescript from "rollup-plugin-typescript";
import jsx from "rollup-plugin-jsx";
// import babel from "rollup-plugin-babel";
export default {
    input: 'src/main.jsx',
    output: {
        file: 'bundle.js',
        format: 'cjs'
    },
    plugins: [
        typescript({
            "target": "es5",
            "sourceMap": false
        }),
        jsx({
            arrayChildren: true,
            factory: 'React.createElement',
            // spreadFn: 'React.createAttribute',
            unknownTagPattern: 'React.createComponent({tag})',
            // passUnknownTagsToFactory: "React.createUnknownTag"
        }),
        // babel()
    ]
};
