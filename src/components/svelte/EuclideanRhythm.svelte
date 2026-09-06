<script lang="ts">
  interface Props {
    pattern: string;
  }

  let { pattern }: Props = $props();

  // One `;`-separated pattern per row, read left to right like a step
  // sequencer: a rhythm is a sequence in time, so it lays out horizontally.
  const rows = $derived(
    pattern.split(";").map((row) =>
      row.split(",").map((slot) => {
        const [bit, pos] = slot.split(":");
        return { hit: bit === "1", pos: Number.parseInt(pos, 10) };
      }),
    ),
  );
</script>

<div class="rhythm">
  {#each rows as row, ri (ri)}
    <div class="row">
      {#each row as slot, si (si)}
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
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
    margin-block-start: 1rem;
  }
  .row {
    display: flex;
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
