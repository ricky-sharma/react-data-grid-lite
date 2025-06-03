import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import strip from '@rollup/plugin-strip';
import cssnano from 'cssnano';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            exports: 'named',
            compact: true
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            compact: true
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
            plugins: [cssnano()]
        }),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            babelHelpers: 'bundled'
        }),
        terser({
            compress: {
                pure_getters: true,
                passes: 2,
                unsafe: true
            },
            format: {
                comments: false
            }
        }),
        strip({
            include: '**/*.(js|jsx)',
            functions: ['console.*', 'assert.*', 'debug', 'alert']
        })
    ]
};