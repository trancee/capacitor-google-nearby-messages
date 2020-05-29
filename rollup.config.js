import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'dist/esm/index.js',
  output: {
    file: 'dist/capacitor-google-nearby-messages.js',
    format: 'iife',
    name: 'capacitorPlugin',
    sourcemap: true
  },
  plugins: [
    nodeResolve()
  ]
};
