<script lang="ts">
  interface Props {
    pattern: string
  }

  let { pattern }: Props = $props()

  const columns = $derived(
    pattern.split(";").map((col) =>
      col.split(",").map((slot) => {
        const [bit, pos] = slot.split(":")
        return { hit: bit === "1", pos: Number.parseInt(pos, 10) }
      }),
    ),
  )
</script>

<div class="rhythm">
  {#each columns as col, ci (ci)}
    <div class="column">
      {#each col as slot, si (si)}
        <div class="slot" class:hit={slot.hit}>
          <span class="pos">{slot.pos}</span>
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .rhythm {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    align-items: flex-start;
    margin: 1rem 0;
  }
  .column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .slot {
    width: 5rem;
    height: 5rem;
    border: 3px solid var(--anu-gold, #be830e);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: transparent;
  }
  .slot.hit {
    background: var(--anu-gold, #be830e);
  }
  .pos {
    font-size: 1.5rem;
    color: var(--anu-light-grey, #e6e6e6);
    font-family: var(--font-public-sans, sans-serif);
    font-weight: 600;
  }
  .slot.hit .pos {
    color: var(--anu-dark-grey, #0d0d0d);
  }
</style>
