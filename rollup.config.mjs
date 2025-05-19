import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            exports: 'named',
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
        }
    ],
    external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
    ],
    treeshake: true,
    plugins: [
        resolve({
            extensions: ['.js', '.jsx'] 
        }),
        postcss({
            inject: true,
            minimize: true,
        }),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled'
        }),
        terser()
    ]
};