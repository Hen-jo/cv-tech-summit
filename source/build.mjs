import {build} from 'esbuild';
import {copyFileSync} from 'node:fs';
await build({entryPoints:['src/intro.mjs'],bundle:true,format:'iife',target:['es2020'],minify:true,outfile:'../intro.js',legalComments:'eof'});
copyFileSync('node_modules/three/LICENSE','../licenses/three-LICENSE.txt');
