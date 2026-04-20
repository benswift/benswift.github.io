<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import ShaderPad from "shaderpad"

  interface Props {
    phrases: string[]
  }

  let { phrases }: Props = $props()

  let containerEl: HTMLDivElement
  let glCanvas: HTMLCanvasElement
  let textCanvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D | null = null
  let shader: ShaderPad | null = null
  let resizeObserver: ResizeObserver | null = null
  let tickInterval: number | null = null

  const TARGET_FPS = 12
  const MOBILE_BREAKPOINT = 640
  const METRICS = {
    mobile: { charWidth: 10, rowPitch: 22, fontSize: 15 },
    desktop: { charWidth: 14, rowPitch: 30, fontSize: 20 },
  }
  let charWidth = METRICS.desktop.charWidth
  let rowPitch = METRICS.desktop.rowPitch
  let fontSize = METRICS.desktop.fontSize
  let font = buildFontString(fontSize)

  function buildFontString(size: number) {
    return `700 ${size}px "Atkinson Hyperlegible Mono Variable", "SF Mono", ui-monospace, monospace`
  }

  function updateMetrics(width: number) {
    const m = width < MOBILE_BREAKPOINT ? METRICS.mobile : METRICS.desktop
    charWidth = m.charWidth
    rowPitch = m.rowPitch
    fontSize = m.fontSize
    font = buildFontString(fontSize)
  }
  const TYPE_RATE_MIN = 7
  const TYPE_RATE_MAX = 13
  const HEAD_CSS = "rgb(255, 248, 232)"
  const HEAD_GLOW_CSS = "rgba(245, 158, 11, 0.55)"
  const TAIL_CSS = "rgb(216, 94, 244)"
  const BG_RGBA = "rgba(12, 6, 22, 0.05)"
  const BURST_DURATION = 1.6
  const BURST_INTERVAL_MIN = 4.5
  const BURST_INTERVAL_MAX = 9.5
  const MAX_PHRASE_LEN = 36
  const FALLBACK_PHRASES = ["benswift", "human-scale AI", "livecoding", "cybernetics"]

  interface Row {
    y: number
    phrase: string
    phraseIdx: number
    startX: number
    lastHeadChar: string
    rate: number
    accumulator: number
    state: "typing" | "idle"
    idleUntil: number
  }

  let rows: Row[] = []
  let widthPx = 0
  let heightPx = 0
  let dpr = 1
  let numRows = 0
  let burstActive = false
  let burstStart = 0
  let nextBurstAt = 0
  let lastTime = 0
  let activePhrases: string[] = []

  const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_text;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_burstProgress;
uniform float u_burstActive;
out vec4 outColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = v_uv;

  // Sample the text canvas, then blend in a small chromatic aberration
  vec3 base = texture(u_text, uv).rgb;
  float aberr = 0.0012;
  float r = texture(u_text, uv + vec2(aberr, 0.0)).r;
  float b = texture(u_text, uv - vec2(aberr, 0.0)).b;
  vec3 col = vec3(mix(base.r, r, 0.75), base.g, mix(base.b, b, 0.75));

  // Fine horizontal scanlines
  float scan = 0.93 + 0.07 * sin(uv.y * u_resolution.y * 2.2);
  col *= scan;

  // Subtle film grain
  float grain = hash(uv * u_resolution + vec2(u_time * 37.0, 0.0));
  col += (grain - 0.5) * 0.03;

  // Evaluation-burst sweep
  if (u_burstActive > 0.5) {
    float p = u_burstProgress;
    float sweepX = p * 1.35 - 0.175;
    float lineX = uv.x - uv.y * 0.22;
    float dist = abs(lineX - sweepX);
    float core = exp(-dist * 42.0);
    float halo = exp(-dist * 9.0) * 0.3;
    float envelope = smoothstep(0.0, 0.12, p) * (1.0 - smoothstep(0.82, 1.0, p));
    float pulse = (core + halo) * envelope;
    // Flash colour shifts across the sweep (blue -> purple)
    vec3 flash = mix(vec3(0.23, 0.51, 0.96), vec3(0.75, 0.18, 0.87), 0.55 + 0.45 * sin(uv.y * 2.8 + u_time * 0.5));
    col += pulse * flash * 0.65;
    // Intensify anything painted on the text canvas (the text lights up)
    float textLum = dot(base, vec3(0.299, 0.587, 0.114));
    col += textLum * pulse * vec3(1.0, 0.92, 0.75) * 1.8;
  }

  // Warm purple vignette
  vec2 vv = uv - 0.5;
  float vig = 1.0 - dot(vv, vv) * 1.05;
  col *= clamp(vig, 0.4, 1.0);

  outColor = vec4(col, 1.0);
}
`

  function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  function randFloat(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  function pickPhrase() {
    return activePhrases[Math.floor(Math.random() * activePhrases.length)] ?? "benswift"
  }

  function pickStartX(phrase: string) {
    const textWidth = phrase.length * charWidth
    const slack = Math.max(0, widthPx - textWidth - charWidth * 2)
    return charWidth + randInt(0, slack + 1)
  }

  function resetRow(row: Row, now: number) {
    row.phrase = pickPhrase()
    row.phraseIdx = 0
    row.startX = pickStartX(row.phrase)
    row.lastHeadChar = ""
    row.rate = randFloat(TYPE_RATE_MIN, TYPE_RATE_MAX)
    row.accumulator = 0
    row.state = "typing"
    row.idleUntil = now
  }

  function initRows(now: number) {
    rows = []
    for (let i = 0; i < numRows; i++) {
      const phrase = pickPhrase()
      const row: Row = {
        y: i * rowPitch + Math.floor((rowPitch - fontSize) / 2),
        phrase,
        phraseIdx: 0,
        startX: pickStartX(phrase),
        lastHeadChar: "",
        rate: randFloat(TYPE_RATE_MIN, TYPE_RATE_MAX),
        accumulator: Math.random(),
        state: "idle",
        idleUntil: now + randFloat(0, 3.5),
      }
      rows.push(row)
    }
  }

  function resize() {
    if (!containerEl || !textCanvas || !glCanvas) return
    const rect = containerEl.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    widthPx = Math.max(1, Math.floor(rect.width))
    heightPx = Math.max(1, Math.floor(rect.height))
    updateMetrics(widthPx)

    textCanvas.width = Math.max(1, Math.floor(widthPx * dpr))
    textCanvas.height = Math.max(1, Math.floor(heightPx * dpr))
    ctx = textCanvas.getContext("2d")
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.textBaseline = "top"
      ctx.font = font
      ctx.fillStyle = "#0c0614"
      ctx.fillRect(0, 0, widthPx, heightPx)
    }

    glCanvas.width = textCanvas.width
    glCanvas.height = textCanvas.height

    const verticalSlack = Math.max(0, heightPx - rowPitch * 2)
    numRows = Math.max(1, Math.floor(verticalSlack / rowPitch) + 2)
    initRows(performance.now() / 1000)
  }

  function advance(now: number) {
    if (!ctx) return
    const t = now / 1000
    const dt = lastTime === 0 ? 1 / TARGET_FPS : Math.min(0.25, (now - lastTime) / 1000)
    lastTime = now

    // Fade toward bg (trail decay)
    ctx.fillStyle = BG_RGBA
    ctx.fillRect(0, 0, widthPx, heightPx)

    ctx.textBaseline = "top"
    ctx.font = font

    for (const row of rows) {
      if (row.state === "idle") {
        if (t >= row.idleUntil) resetRow(row, t)
        else continue
      }

      row.accumulator += row.rate * dt
      while (row.accumulator >= 1 && row.phraseIdx < row.phrase.length) {
        row.accumulator -= 1
        const currentIdx = row.phraseIdx
        const x = row.startX + currentIdx * charWidth

        // Demote previous head char to tail colour
        if (row.lastHeadChar && currentIdx > 0) {
          const prevX = row.startX + (currentIdx - 1) * charWidth
          ctx.fillStyle = TAIL_CSS
          ctx.fillText(row.lastHeadChar, prevX, row.y)
        }

        // Paint new head char with amber glow
        const ch = row.phrase[currentIdx]!
        ctx.shadowColor = HEAD_GLOW_CSS
        ctx.shadowBlur = 10
        ctx.fillStyle = HEAD_CSS
        ctx.fillText(ch, x, row.y)
        ctx.shadowBlur = 0
        row.lastHeadChar = ch
        row.phraseIdx += 1
      }

      // Phrase fully typed — demote the final head to tail and enter idle hold
      if (row.phraseIdx >= row.phrase.length && row.state === "typing") {
        if (row.lastHeadChar) {
          const lastX = row.startX + (row.phraseIdx - 1) * charWidth
          ctx.fillStyle = TAIL_CSS
          ctx.fillText(row.lastHeadChar, lastX, row.y)
          row.lastHeadChar = ""
        }
        row.state = "idle"
        row.idleUntil = t + randFloat(1.2, 3.2)
      }
    }

    // Update burst timing
    if (!burstActive && t >= nextBurstAt) {
      burstActive = true
      burstStart = t
    }
    let burstProgress = -1
    if (burstActive) {
      burstProgress = (t - burstStart) / BURST_DURATION
      if (burstProgress >= 1) {
        burstActive = false
        nextBurstAt = t + randFloat(BURST_INTERVAL_MIN, BURST_INTERVAL_MAX)
        burstProgress = -1
      }
    }
    return burstProgress
  }

  function prepareActivePhrases() {
    const cleaned = phrases
      .map((p) => p.replaceAll(/\s+/g, " ").trim())
      .filter((p) => p.length > 0 && p.length <= MAX_PHRASE_LEN)
    const source = cleaned.length > 0 ? cleaned : FALLBACK_PHRASES
    const seen = new Set<string>()
    const uniq: string[] = []
    for (const p of source) {
      const k = p.toLowerCase()
      if (!seen.has(k)) {
        seen.add(k)
        uniq.push(p)
      }
    }
    activePhrases = uniq
  }

  function tick() {
    if (!shader) return
    const bp = advance(performance.now())
    shader.updateTextures({ u_text: textCanvas })
    shader.updateUniforms({
      u_burstProgress: bp !== undefined && bp >= 0 ? bp : 0,
      u_burstActive: bp !== undefined && bp >= 0 ? 1 : 0,
    })
    shader.step()
  }

  function startLoop() {
    if (tickInterval !== null) return
    tickInterval = window.setInterval(tick, 1000 / TARGET_FPS)
  }

  function stopLoop() {
    if (tickInterval !== null) {
      clearInterval(tickInterval)
      tickInterval = null
    }
  }

  function onVisibilityChange() {
    if (document.hidden) stopLoop()
    else startLoop()
  }

  onMount(() => {
    prepareActivePhrases()
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    resize()
    shader = new ShaderPad(FRAG, { canvas: glCanvas })
    shader.initializeTexture("u_text", textCanvas, {
      minFilter: "LINEAR",
      magFilter: "LINEAR",
    })
    shader.initializeUniform("u_burstProgress", "float", 0)
    shader.initializeUniform("u_burstActive", "float", 0)

    nextBurstAt = performance.now() / 1000 + 2.5

    if (prefersReducedMotion) {
      let simulated = 0
      for (let i = 0; i < 60; i++) {
        simulated += 1000 / TARGET_FPS
        advance(simulated)
      }
      shader.updateTextures({ u_text: textCanvas })
      shader.updateUniforms({ u_burstProgress: 0, u_burstActive: 0 })
      shader.step()
    } else {
      startLoop()
      document.addEventListener("visibilitychange", onVisibilityChange)
    }

    resizeObserver = new ResizeObserver(() => {
      resize()
    })
    resizeObserver.observe(containerEl)
  })

  onDestroy(() => {
    document.removeEventListener("visibilitychange", onVisibilityChange)
    stopLoop()
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (shader) {
      shader.destroy()
      shader = null
    }
  })
</script>

<div bind:this={containerEl} class="hero-canvas" aria-hidden="true">
  <canvas bind:this={textCanvas} class="text-canvas"></canvas>
  <canvas bind:this={glCanvas} class="gl-canvas"></canvas>
</div>

<style>
  .hero-canvas {
    position: relative;
    width: 100vw;
    margin: 0 calc(50% - 50vw) 1.5rem;
    aspect-ratio: 2844 / 1600;
    max-height: 506px;
    overflow: hidden;
    background: #0c0614;
  }

  .text-canvas {
    display: none;
  }

  .gl-canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
