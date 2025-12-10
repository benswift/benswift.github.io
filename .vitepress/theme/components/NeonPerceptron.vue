<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const containerRef = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);
const wireGamma = ref(2.2);

// Seven-segment patterns: [a,b,c,d,e,f,g] for digits 0-9
const SEVEN_SEGMENT_PATTERNS = [
    [1, 1, 1, 1, 1, 1, 0], // 0
    [0, 1, 1, 0, 0, 0, 0], // 1
    [1, 1, 0, 1, 1, 0, 1], // 2
    [1, 1, 1, 1, 0, 0, 1], // 3
    [0, 1, 1, 0, 0, 1, 1], // 4
    [1, 0, 1, 1, 0, 1, 1], // 5
    [1, 0, 1, 1, 1, 1, 1], // 6
    [1, 1, 1, 0, 0, 0, 0], // 7
    [1, 1, 1, 1, 1, 1, 1], // 8
    [1, 1, 1, 1, 0, 1, 1], // 9
];

// Network configuration
const INPUT_SIZE = 25;
const HIDDEN_SIZE = 9;
const OUTPUT_SIZE = 10;

// Three.js instances (assigned in onMounted)
let THREE: typeof import("three");
let scene: import("three").Scene;
let camera: import("three").PerspectiveCamera;
let renderer: import("three").WebGLRenderer;
let controls: import("three/addons/controls/OrbitControls.js").OrbitControls;
let animationId: number;

// Network state
let inputState: number[] = [];
let weights = { dense_0: [] as number[], dense_1: [] as number[] };
const layerX = { input: -4, hidden: 0, output: 4 };
const nodes: {
    input: import("three").Mesh[];
    hidden: import("three").Mesh[];
    output: import("three").Group[];
} = { input: [], hidden: [], output: [] };
const edges: {
    inputToHidden: import("three/addons/lines/Line2.js").Line2[];
    hiddenToOutput: import("three/addons/lines/Line2.js").Line2[];
} = { inputToHidden: [], hiddenToOutput: [] };

// Raycaster for input interaction
let raycaster: import("three").Raycaster;
let mouse: import("three").Vector2;
let isDrawing = false;

function generateRandomWeights() {
    // Xavier/Glorot initialisation for better starting point
    const scale0 = Math.sqrt(2 / (INPUT_SIZE + HIDDEN_SIZE));
    const scale1 = Math.sqrt(2 / (HIDDEN_SIZE + OUTPUT_SIZE));

    weights.dense_0 = Array.from(
        { length: INPUT_SIZE * HIDDEN_SIZE },
        () => (Math.random() * 2 - 1) * scale0,
    );
    weights.dense_1 = Array.from(
        { length: HIDDEN_SIZE * OUTPUT_SIZE },
        () => (Math.random() * 2 - 1) * scale1,
    );
}

function createSevenSegmentGroup(
    THREE: typeof import("three"),
    digit: number,
    size = 0.4,
) {
    const group = new THREE.Group();

    const panelWidth = size * 0.7;
    const panelHeight = size * 1.1;
    const panelDepth = size * 0.08;

    const panelGeometry = new THREE.BoxGeometry(
        panelWidth,
        panelHeight,
        panelDepth,
    );
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.8,
        metalness: 0.1,
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.z = -panelDepth / 2;
    group.add(panel);

    const innerWidth = panelWidth * 0.85;
    const innerHeight = panelHeight * 0.9;
    const innerGeometry = new THREE.PlaneGeometry(innerWidth, innerHeight);
    const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.9,
        side: THREE.DoubleSide,
    });
    const innerPanel = new THREE.Mesh(innerGeometry, innerMaterial);
    innerPanel.position.z = 0.001;
    group.add(innerPanel);

    const segmentLength = size * 0.28;
    const segmentThickness = size * 0.06;
    const halfHeight = size * 0.38;
    const halfWidth = segmentLength / 2 + segmentThickness * 0.3;

    const segmentShape = new THREE.Shape();
    const sl = segmentLength / 2;
    const st = segmentThickness / 2;
    const taper = st * 0.7;
    segmentShape.moveTo(-sl + taper, 0);
    segmentShape.lineTo(-sl, st);
    segmentShape.lineTo(sl, st);
    segmentShape.lineTo(sl + taper, 0);
    segmentShape.lineTo(sl, -st);
    segmentShape.lineTo(-sl, -st);
    segmentShape.closePath();

    const segmentGeometry = new THREE.ShapeGeometry(segmentShape);
    const vertSegmentGeometry = segmentGeometry.clone();
    vertSegmentGeometry.rotateZ(Math.PI / 2);

    const positions = [
        { x: 0, y: halfHeight, geom: segmentGeometry },
        { x: halfWidth, y: halfHeight / 2, geom: vertSegmentGeometry },
        { x: halfWidth, y: -halfHeight / 2, geom: vertSegmentGeometry },
        { x: 0, y: -halfHeight, geom: segmentGeometry },
        { x: -halfWidth, y: -halfHeight / 2, geom: vertSegmentGeometry },
        { x: -halfWidth, y: halfHeight / 2, geom: vertSegmentGeometry },
        { x: 0, y: 0, geom: segmentGeometry },
    ];

    const segments: import("three").Mesh[] = [];
    const pattern = SEVEN_SEGMENT_PATTERNS[digit];

    for (let i = 0; i < 7; i++) {
        const isOn = pattern[i] === 1;
        const material = new THREE.MeshStandardMaterial({
            color: isOn ? 0xff3300 : 0x1a0800,
            emissive: 0xff3300,
            emissiveIntensity: isOn ? 1.0 : 0.02,
            roughness: 0.3,
            metalness: 0.0,
            side: THREE.DoubleSide,
        });
        const segment = new THREE.Mesh(positions[i].geom.clone(), material);
        segment.position.set(positions[i].x, positions[i].y, 0.01);
        segment.userData = { segmentIndex: i, isOn };
        segments.push(segment);
        group.add(segment);
    }

    group.userData = { segments, digit };
    return group;
}

async function initScene() {
    if (!containerRef.value) return;

    // Dynamic imports for Three.js (avoids SSR issues)
    THREE = await import("three");
    const { OrbitControls } =
        await import("three/addons/controls/OrbitControls.js");
    const { Line2 } = await import("three/addons/lines/Line2.js");
    const { LineMaterial } = await import("three/addons/lines/LineMaterial.js");
    const { LineGeometry } = await import("three/addons/lines/LineGeometry.js");

    const container = containerRef.value;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        0.1,
        1000,
    );
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Input state
    inputState = new Array(INPUT_SIZE).fill(0);
    generateRandomWeights();

    // Create nodes
    createNodes(THREE);
    createEdges(THREE, Line2, LineMaterial, LineGeometry);

    // Mouse events
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("mouseleave", onMouseUp);

    // Touch events for mobile
    renderer.domElement.addEventListener("touchstart", onTouchStart, {
        passive: false,
    });
    renderer.domElement.addEventListener("touchmove", onTouchMove, {
        passive: false,
    });
    renderer.domElement.addEventListener("touchend", onTouchEnd);

    updateVisualisation();
    animate();
}

function createNodes(THREE: typeof import("three")) {
    const pixelSize = 0.45;
    const pixelGeometry = new THREE.PlaneGeometry(pixelSize, pixelSize);

    for (let i = 0; i < INPUT_SIZE; i++) {
        const row = Math.floor(i / 5);
        const col = i % 5;
        const y = (2 - row) * 0.5;
        const z = (col - 2) * 0.5;

        const material = new THREE.MeshStandardMaterial({
            color: 0x4488ff,
            emissive: 0x4488ff,
            emissiveIntensity: 0.0,
            side: THREE.DoubleSide,
        });
        const node = new THREE.Mesh(pixelGeometry, material);
        node.position.set(layerX.input, y, z);
        node.rotation.y = Math.PI / 2;
        node.userData = { layer: "input", index: i };
        scene.add(node);
        nodes.input.push(node);
    }

    const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);

    for (let i = 0; i < HIDDEN_SIZE; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        const y = (1 - row) * 0.6;
        const z = (col - 1) * 0.6;

        const material = new THREE.MeshStandardMaterial({
            color: 0x44ff88,
            emissive: 0x44ff88,
            emissiveIntensity: 0.1,
        });
        const node = new THREE.Mesh(nodeGeometry, material);
        node.position.set(layerX.hidden, y, z);
        node.userData = { layer: "hidden", index: i };
        scene.add(node);
        nodes.hidden.push(node);
    }

    const circleRadius = 1.2;
    for (let i = 0; i < OUTPUT_SIZE; i++) {
        const angle = (i / OUTPUT_SIZE) * Math.PI * 2 - Math.PI / 2;
        const y = Math.sin(angle) * circleRadius;
        const z = Math.cos(angle) * circleRadius;

        const display = createSevenSegmentGroup(THREE, i, 0.35);
        display.position.set(layerX.output, y, z);
        display.rotation.y = Math.PI / 2;
        display.userData.layer = "output";
        display.userData.index = i;
        scene.add(display);
        nodes.output.push(display);
    }
}

function createEdges(
    THREE: typeof import("three"),
    Line2: typeof import("three/addons/lines/Line2.js").Line2,
    LineMaterial: typeof import("three/addons/lines/LineMaterial.js").LineMaterial,
    LineGeometry: typeof import("three/addons/lines/LineGeometry.js").LineGeometry,
) {
    const createEdge = (
        from: import("three").Vector3,
        to: import("three").Vector3,
    ) => {
        const geometry = new LineGeometry();
        geometry.setPositions([from.x, from.y, from.z, to.x, to.y, to.z]);

        const material = new LineMaterial({
            color: 0x444444,
            linewidth: 2,
            transparent: true,
            opacity: 0.3,
            resolution: new THREE.Vector2(
                window.innerWidth,
                window.innerHeight,
            ),
        });

        return new Line2(geometry, material);
    };

    for (let i = 0; i < INPUT_SIZE; i++) {
        for (let j = 0; j < HIDDEN_SIZE; j++) {
            const edge = createEdge(
                nodes.input[i].position,
                nodes.hidden[j].position,
            );
            edge.userData = { fromLayer: "input", from: i, to: j };
            edges.inputToHidden.push(edge);
            scene.add(edge);
        }
    }

    for (let i = 0; i < HIDDEN_SIZE; i++) {
        for (let j = 0; j < OUTPUT_SIZE; j++) {
            const edge = createEdge(
                nodes.hidden[i].position,
                nodes.output[j].position,
            );
            edge.userData = { fromLayer: "hidden", from: i, to: j };
            edges.hiddenToOutput.push(edge);
            scene.add(edge);
        }
    }
}

function forwardDense(
    input: number[],
    weights: number[],
    inSize: number,
    outSize: number,
): number[] {
    const output = new Array(outSize).fill(0);
    for (let j = 0; j < outSize; j++) {
        for (let i = 0; i < inSize; i++) {
            output[j] += input[i] * weights[i * outSize + j];
        }
    }
    return output;
}

function softmax(x: number[]): number[] {
    const max = Math.max(...x);
    const exps = x.map((v) => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
}

function updateVisualisation() {
    if (!weights.dense_0.length || !weights.dense_1.length) return;

    const hidden = forwardDense(
        inputState,
        weights.dense_0,
        INPUT_SIZE,
        HIDDEN_SIZE,
    ).map(Math.tanh);

    const preOutput = forwardDense(
        hidden,
        weights.dense_1,
        HIDDEN_SIZE,
        OUTPUT_SIZE,
    );
    const output = softmax(preOutput);

    updateNodeVisuals(inputState, hidden, output);
    updateEdgeVisuals(inputState, hidden);
}

function updateNodeVisuals(
    input: number[],
    hidden: number[],
    output: number[],
) {
    input.forEach((value, i) => {
        if (nodes.input[i]) {
            (
                nodes.input[i].material as import("three").MeshStandardMaterial
            ).emissiveIntensity = value;
        }
    });

    hidden.forEach((value, i) => {
        if (nodes.hidden[i]) {
            (
                nodes.hidden[i].material as import("three").MeshStandardMaterial
            ).emissiveIntensity = Math.abs(value) * 0.8;
        }
    });

    output.forEach((activation, i) => {
        const display = nodes.output[i];
        if (!display || !display.userData.segments) return;

        const digit = display.userData.digit;
        const pattern = SEVEN_SEGMENT_PATTERNS[digit];

        display.userData.segments.forEach(
            (segment: import("three").Mesh, segIdx: number) => {
                const isOn = pattern[segIdx] === 1;
                const mat =
                    segment.material as import("three").MeshStandardMaterial;
                if (isOn) {
                    const intensity = 0.15 + activation * 0.85;
                    mat.emissiveIntensity = intensity;
                    mat.color.setHex(activation > 0.3 ? 0xff3300 : 0x661400);
                } else {
                    mat.emissiveIntensity = 0.02;
                    mat.color.setHex(0x1a0800);
                }
            },
        );
    });
}

function updateEdgeVisuals(input: number[], hidden: number[]) {
    const setEdgeAppearance = (
        edge: import("three/addons/lines/Line2.js").Line2,
        activation: number,
    ) => {
        if (!edge) return;

        const absActivation = Math.min(Math.abs(activation), 2) / 2;
        const gamma = wireGamma.value;
        const corrected = Math.pow(absActivation, 1 / gamma);
        const mat =
            edge.material as import("three/addons/lines/LineMaterial.js").LineMaterial;

        if (Math.abs(activation) < 0.001) {
            mat.color.setHex(0x444444);
            mat.opacity = 0.05;
            mat.linewidth = 1;
        } else if (activation >= 0) {
            // Orange for positive (colourblind-safe)
            mat.color.setHex(0xe69f00);
            mat.opacity = 0.1 + corrected * 0.5;
            mat.linewidth = 1 + corrected * 4;
        } else {
            // Blue for negative (colourblind-safe)
            mat.color.setHex(0x0072b2);
            mat.opacity = 0.1 + corrected * 0.5;
            mat.linewidth = 1 + corrected * 4;
        }
    };

    let edgeIdx = 0;
    for (let i = 0; i < INPUT_SIZE; i++) {
        for (let j = 0; j < HIDDEN_SIZE; j++) {
            const weight = weights.dense_0[i * HIDDEN_SIZE + j];
            const activation = input[i] * weight;
            setEdgeAppearance(edges.inputToHidden[edgeIdx], activation);
            edgeIdx++;
        }
    }

    edgeIdx = 0;
    for (let i = 0; i < HIDDEN_SIZE; i++) {
        for (let j = 0; j < OUTPUT_SIZE; j++) {
            const weight = weights.dense_1[i * OUTPUT_SIZE + j];
            const activation = hidden[i] * weight;
            setEdgeAppearance(edges.hiddenToOutput[edgeIdx], activation);
            edgeIdx++;
        }
    }
}

function getMousePosition(event: MouseEvent | Touch) {
    if (!renderer) return;
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function hitTestInput(): boolean {
    if (!raycaster || !camera) return false;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodes.input);
    return intersects.length > 0;
}

function onDraw() {
    if (!raycaster || !camera) return;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodes.input);

    if (intersects.length > 0) {
        const node = intersects[0].object;
        const index = node.userData.index;
        const increment = 0.15;
        inputState[index] = Math.min(1, inputState[index] + increment);
        updateVisualisation();
    }
}

function onMouseDown(event: MouseEvent) {
    getMousePosition(event);
    if (hitTestInput()) {
        isDrawing = true;
        controls.enabled = false;
        onDraw();
    }
}

function onMouseMove(event: MouseEvent) {
    if (isDrawing) {
        getMousePosition(event);
        onDraw();
    }
}

function onMouseUp() {
    isDrawing = false;
    if (controls) controls.enabled = true;
}

function onTouchStart(event: TouchEvent) {
    if (event.touches.length === 1) {
        event.preventDefault();
        getMousePosition(event.touches[0]);
        if (hitTestInput()) {
            isDrawing = true;
            controls.enabled = false;
            onDraw();
        }
    }
}

function onTouchMove(event: TouchEvent) {
    if (isDrawing && event.touches.length === 1) {
        event.preventDefault();
        getMousePosition(event.touches[0]);
        onDraw();
    }
}

function onTouchEnd() {
    isDrawing = false;
    if (controls) controls.enabled = true;
}

function onResize() {
    if (!containerRef.value || !camera || !renderer) return;

    const container = containerRef.value;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);

    const resolution = new THREE.Vector2(
        container.clientWidth,
        container.clientHeight,
    );
    [...edges.inputToHidden, ...edges.hiddenToOutput].forEach((edge) => {
        const mat =
            edge?.material as import("three/addons/lines/LineMaterial.js").LineMaterial;
        if (mat?.resolution) {
            mat.resolution.copy(resolution);
        }
    });
}

function animate() {
    animationId = requestAnimationFrame(animate);
    if (controls) controls.update();
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

function resetInput() {
    inputState.fill(0);
    updateVisualisation();
}

function randomiseWeights() {
    generateRandomWeights();
    updateVisualisation();
}

function toggleFullscreen() {
    if (!containerRef.value) return;

    if (!document.fullscreenElement) {
        containerRef.value.requestFullscreen().catch((err) => {
            console.error("Fullscreen request failed:", err);
        });
    } else {
        document.exitFullscreen();
    }
}

function onFullscreenChange() {
    isFullscreen.value = !!document.fullscreenElement;
    // Delay resize to allow layout to settle
    setTimeout(onResize, 100);
}

function onGammaChange(event: Event) {
    wireGamma.value = parseFloat((event.target as HTMLInputElement).value);
    updateVisualisation();
}

function cleanup() {
    if (animationId) cancelAnimationFrame(animationId);

    if (renderer) {
        renderer.domElement.removeEventListener("mousedown", onMouseDown);
        renderer.domElement.removeEventListener("mousemove", onMouseMove);
        renderer.domElement.removeEventListener("mouseup", onMouseUp);
        renderer.domElement.removeEventListener("mouseleave", onMouseUp);
        renderer.domElement.removeEventListener("touchstart", onTouchStart);
        renderer.domElement.removeEventListener("touchmove", onTouchMove);
        renderer.domElement.removeEventListener("touchend", onTouchEnd);
        renderer.dispose();
    }

    // Dispose geometries and materials
    nodes.input.forEach((n) => {
        n.geometry.dispose();
        (n.material as import("three").Material).dispose();
    });
    nodes.hidden.forEach((n) => {
        n.geometry.dispose();
        (n.material as import("three").Material).dispose();
    });
    nodes.output.forEach((g) => {
        g.traverse((child) => {
            if ((child as import("three").Mesh).geometry) {
                (child as import("three").Mesh).geometry.dispose();
            }
            if ((child as import("three").Mesh).material) {
                (
                    (child as import("three").Mesh)
                        .material as import("three").Material
                ).dispose();
            }
        });
    });
    edges.inputToHidden.forEach((e) => {
        e.geometry.dispose();
        (e.material as import("three").Material).dispose();
    });
    edges.hiddenToOutput.forEach((e) => {
        e.geometry.dispose();
        (e.material as import("three").Material).dispose();
    });

    // Clear arrays
    nodes.input = [];
    nodes.hidden = [];
    nodes.output = [];
    edges.inputToHidden = [];
    edges.hiddenToOutput = [];
}

onMounted(() => {
    initScene();
    window.addEventListener("resize", onResize);
    document.addEventListener("fullscreenchange", onFullscreenChange);
});

onUnmounted(() => {
    window.removeEventListener("resize", onResize);
    document.removeEventListener("fullscreenchange", onFullscreenChange);
    cleanup();
});
</script>

<template>
    <div
        ref="containerRef"
        class="neon-perceptron"
        :class="{ fullscreen: isFullscreen }"
    >
        <div class="controls">
            <button @click="resetInput" title="Clear the input grid">
                Reset
            </button>
            <button
                @click="randomiseWeights"
                title="Generate new random weights"
            >
                Randomise
            </button>
            <div class="slider-container">
                <label>
                    Wire gamma: {{ wireGamma.toFixed(1) }}
                    <input
                        type="range"
                        min="0.5"
                        max="4.0"
                        step="0.1"
                        :value="wireGamma"
                        @input="onGammaChange"
                    />
                </label>
            </div>
        </div>
        <button
            class="fullscreen-button"
            @click="toggleFullscreen"
            :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
        >
            <svg
                v-if="!isFullscreen"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                />
            </svg>
            <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path
                    d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
                />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.neon-perceptron {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #111;
    border-radius: 8px;
    overflow: hidden;
}

.neon-perceptron.fullscreen {
    aspect-ratio: unset;
    width: 100vw;
    height: 100vh;
    border-radius: 0;
}

.neon-perceptron canvas {
    display: block;
}

.controls {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 100;
}

.controls button {
    padding: 0.5rem 1rem;
    background: #333;
    color: #fff;
    border: 1px solid #666;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
}

.controls button:hover {
    background: #444;
}

.slider-container {
    background: #333;
    padding: 0.5rem;
    border: 1px solid #666;
    border-radius: 4px;
    color: #fff;
    font-size: 0.75rem;
}

.slider-container label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.slider-container input[type="range"] {
    width: 120px;
}

.fullscreen-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0.5rem;
    background: #333;
    color: #fff;
    border: 1px solid #666;
    border-radius: 4px;
    cursor: pointer;
    z-index: 100;
    transition: background 0.2s;
}

.fullscreen-button:hover {
    background: #444;
}

.fullscreen-button svg {
    width: 100%;
    height: 100%;
}
</style>
