<script lang="ts">
  import { incrementCell, clearLastCell } from "./pixel-pad-state"

  type Props = {
    pixels: number[]
    rows: number
    cols: number
    step?: number
    onChange: (pixels: number[]) => void
  }

  let { pixels, rows, cols, step = 0.15, onChange }: Props = $props()

  let svgEl: SVGSVGElement
  let isDrawing = $state(false)
  let lastIndex: number | null = null

  function cellFill(value: number): string {
    if (value <= 0) return "var(--bg-soft, #252525)"
    const alpha = 0.3 + value * 0.7
    return `rgba(190, 46, 221, ${alpha})`
  }

  function pointerToCell(clientX: number, clientY: number): number | null {
    if (!svgEl) return null
    const ctm = svgEl.getScreenCTM()
    if (!ctm) return null
    const pt = svgEl.createSVGPoint()
    pt.x = clientX
    pt.y = clientY
    const local = pt.matrixTransform(ctm.inverse())
    const col = Math.floor(local.x)
    const row = Math.floor(local.y)
    if (col < 0 || col >= cols || row < 0 || row >= rows) return null
    return row * cols + col
  }

  function paintAt(clientX: number, clientY: number) {
    const index = pointerToCell(clientX, clientY)
    if (index === null) return
    const result = incrementCell(pixels, index, step, lastIndex)
    lastIndex = result.lastIndex
    if (result.pixels !== pixels) onChange(result.pixels)
  }

  function handleMouseDown(event: MouseEvent) {
    isDrawing = true
    lastIndex = null
    paintAt(event.clientX, event.clientY)
  }

  function handleMouseMove(event: MouseEvent) {
    if (!isDrawing) return
    paintAt(event.clientX, event.clientY)
  }

  function endDrag() {
    isDrawing = false
    lastIndex = clearLastCell(pixels).lastIndex
  }

  function handleTouchStart(event: TouchEvent) {
    if (event.touches.length !== 1) return
    event.preventDefault()
    isDrawing = true
    lastIndex = null
    const t = event.touches[0]
    paintAt(t.clientX, t.clientY)
  }

  function handleTouchMove(event: TouchEvent) {
    if (!isDrawing || event.touches.length !== 1) return
    event.preventDefault()
    const t = event.touches[0]
    paintAt(t.clientX, t.clientY)
  }
</script>

<svg
  bind:this={svgEl}
  class="pixel-drawing-pad"
  viewBox="0 0 {cols} {rows}"
  preserveAspectRatio="xMidYMid meet"
  role="application"
  aria-label="Pixel drawing pad"
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onmouseup={endDrag}
  onmouseleave={endDrag}
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={endDrag}
  ontouchcancel={endDrag}
>
  {#each { length: rows * cols } as _, i}
    <rect
      x={i % cols}
      y={Math.floor(i / cols)}
      width="1"
      height="1"
      fill={cellFill(pixels[i] ?? 0)}
      stroke="var(--divider, #333)"
      stroke-width="0.02"
    />
  {/each}
</svg>

<style>
  .pixel-drawing-pad {
    width: 100%;
    height: 100%;
    display: block;
    touch-action: none;
    cursor: crosshair;
    background: var(--bg-soft, #252525);
    border-radius: 6px 0 6px 6px;
    user-select: none;
  }
</style>
