<template>
    <div class="select-none ">
        <navbar></navbar>
        <div class=" mt-16 cursor-default">
            <h1 class="text-teal-950 text-[4.8em]  font-extrabold">Hallo leer mij kennen!</h1>
            <p class=" font-semibold text-neutral-200 opacity-60 text-2xl">Mijn naam is Roland Meijer en ik ben een Software Developer!<br/>ik zit momenteel in mijn tweede leerjaar.</p>
        </div>
        <NuxtImg class=" -ml-12 absolute bottom-0 h-[23em] mix-blend-luminosity" src="/filler.svg" draggable="false"></NuxtImg>
        
        <div class=" bottom-0 absolute right-0">
            <div class=" right-[-12%] bottom-[-60%] absolute w-[125%] h-[125%] bg-[#1F3F3E] rounded-full"></div>
            <NuxtImg @mouseenter="showglitch" id="myImage" class=" h-[45em] mix-blend-luminosity" src="/Roland.png" draggable="false"></NuxtImg>
        </div>
        <div @mouseleave="hide" id="imageContainer" class=" bottom-0 absolute right-0">
        
        </div>
    </div>
</template>

<script setup>

const hide = () => {
    try {
    document.querySelector("canvas").remove()
    } catch {}
}

const showglitch = () => {

    const imageContainer = document.getElementById("imageContainer");
    const imageElement = document.getElementById("myImage");

    let scene, camera, renderer, planeMesh;
    let isHovered = true;
    let hoverDuration = 0;

    const ANIMATION_CONFIG = {
        updateFrequency: 0.1,
        glitchIntensityMod: 0.5
    };

    const vertexShader = `varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    } `;

    const fragmentShader = `
    uniform sampler2D tDiffuse;
    uniform float glitchIntensity;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv;
        vec4 baseState = texture2D(tDiffuse, uv);

        if (glitchIntensity > 0.0) {
            float segment = floor(uv.y * 18.0); 
            float randomValue = fract(sin(segment * 12345.6789 + glitchIntensity) * 43758.5453); 
            vec2 offset = vec2(randomValue * 0.03, 0.0) * glitchIntensity;

            vec4 redGlitch = texture2D(tDiffuse, uv + offset);
            vec4 greenGlitch = texture2D(tDiffuse, uv - offset);
            vec4 blueGlitch = texture2D(tDiffuse, uv);

            if (mod(segment, 3.0) == 0.0) {
                gl_FragColor = vec4(redGlitch.r, greenGlitch.g, baseState.b, baseState.a);
            } else if (mod(segment, 3.0) == 1.0) {
                gl_FragColor = vec4(baseState.r, greenGlitch.g, blueGlitch.b, baseState.a);
            } else {
                gl_FragColor = vec4(redGlitch.r, baseState.g, blueGlitch.b, baseState.a);
            }
        } else {
            gl_FragColor = baseState; 
        }
    }`;

    function initializeScene(texture) {
        camera = new THREE.PerspectiveCamera(
            90, imageElement.offsetWidth / imageElement.offsetHeight,
            0.01, 10
        );
        camera.position.z = 1;
        scene = new THREE.Scene();

        const shaderUniforms = {
            tDiffuse: { value: texture },
            glitchIntensity: { value: 0.0 }
        };

        planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 2),
            new THREE.ShaderMaterial({
                uniforms: shaderUniforms,
                vertexShader,
                fragmentShader
            })
        );

        scene.add(planeMesh);
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            clearColor: 0x000000,
            clearAlpha: 0,
        });
        renderer.setSize(imageElement.offsetWidth, imageElement.offsetHeight);
        imageContainer.appendChild(renderer.domElement);

    }

    initializeScene(new THREE.TextureLoader().load(imageElement.src));
    animateScene();

    function animateScene() {
        requestAnimationFrame(animateScene);

        if (isHovered) {
            hoverDuration += ANIMATION_CONFIG.updateFrequency;

            if (hoverDuration >= 0.5) {
                hoverDuration = 0;
                planeMesh.material.uniforms.glitchIntensity.value = Math.random() * ANIMATION_CONFIG.glitchIntensityMod;
            }
        }

        renderer.render(scene, camera);
    }

}

</script>

