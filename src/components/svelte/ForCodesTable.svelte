<script lang="ts">
  interface ForCode {
    division: string
    group: string
    field: string
    description: string
  }

  let { codes }: { codes: ForCode[] } = $props()

  let searchQuery = $state("")

  let filteredCodes = $derived(
    searchQuery
      ? codes.filter((code) => {
          const query = searchQuery.toLowerCase()
          return (
            code.field.toLowerCase().includes(query) ||
            code.description.toLowerCase().includes(query) ||
            code.division.toLowerCase().includes(query) ||
            code.group.toLowerCase().includes(query)
          )
        })
      : codes,
  )
</script>

<div class="for-codes-table">
  <input
    bind:value={searchQuery}
    class="search"
    placeholder="type to filter FoR codes..."
  />
  <table>
    <thead>
      <tr>
        <th>FoR Code</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredCodes as code (code.field)}
        <tr>
          <td class="for-code">{code.field}</td>
          <td class="for-description">{code.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .for-codes-table .search {
    width: 100%;
    line-height: 1.6;
    font-size: 1rem;
    padding: 0.3rem 0.6rem;
    border: 2px solid var(--brand-1);
    border-radius: 3px;
    margin-bottom: 1rem;
  }

  .for-codes-table table {
    width: 100%;
    border-collapse: collapse;
  }

  .for-codes-table th,
  .for-codes-table td {
    padding: 0.5rem;
    text-align: left;
    border-bottom: 1px solid var(--divider);
  }

  .for-codes-table .for-code {
    font-family: var(--font-family-mono);
    white-space: nowrap;
  }
</style>
