<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  codes: Array<{
    division: string;
    group: string;
    field: string;
    description: string;
  }>
}>()

const searchQuery = ref('')

const filteredCodes = computed(() => {
  if (!searchQuery.value) return props.codes
  const query = searchQuery.value.toLowerCase()
  return props.codes.filter(code =>
    code.field.toLowerCase().includes(query) ||
    code.description.toLowerCase().includes(query) ||
    code.division.toLowerCase().includes(query) ||
    code.group.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="for-codes-table">
    <input
      v-model="searchQuery"
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
        <tr v-for="code in filteredCodes" :key="code.field">
          <td class="for-code">{{ code.field }}</td>
          <td class="for-description">{{ code.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.for-codes-table .search {
  width: 100%;
  line-height: 1.6;
  font-size: 1rem;
  padding: 0.3rem 0.6rem;
  border: 2pt solid #be2edd;
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
  border-bottom: 1px solid var(--vp-c-divider);
}

.for-codes-table .for-code {
  font-family: var(--vp-font-family-mono);
  white-space: nowrap;
}
</style>
