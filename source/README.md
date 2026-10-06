# CV TECH SUMMIT · real-time titanium intro

The supplied page composition and all sections below the hero are preserved.
The hero now uses Three.js 0.180.0 with an original closed elliptical-section spline sweep, computed vertex normals and tangents, MeshPhysicalMaterial, anisotropic metallic reflections, an original procedural studio environment prefiltered with PMREM, ACES tone mapping, and a 4.2-second perspective camera reveal followed by a slow idle move.

No downloaded model, HDR environment, texture, external font, video, runtime CDN or paid generation service is used. The prior image is retained only as a startup/failure fallback. Dependencies are bundled in ../intro.js as a classic IIFE, with Three.js's MIT license in ../licenses. The source is inspired by the studio-lighting approach in https://pmndrs.github.io/examples/building-live-envmaps/ but copies none of its models or assets.

## Use
Open ../index.html, or serve the dist folder. The classic bundle and local assets do not require ES-module fetching. File opening and GPU rendering have not been visually validated in this execution environment.

Pause motion and Replay intro work by touch or keyboard. Reduced-motion preference starts at a still 3D pose; either play control deliberately opts into animation. Background tabs and offscreen hero regions suspend the animation loop. Canvas resolution is capped and reduced further on sustained low frame rates. On WebGL or shader failure, a static image and “정지 이미지 모드” status appear.

## Edit and build
npm ci
npm run build

Validation performed: bundle/syntax checks; geometry topology, finite vertex attributes, unit normals, source asset presence; exact below-fold HTML preservation; control lifecycle tests with a mocked renderer. These tests do not establish visual quality or actual WebGL shader execution. Browser visual QA was not available through the permitted preview route during this task.
