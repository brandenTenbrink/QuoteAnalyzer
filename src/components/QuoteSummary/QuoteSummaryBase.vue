<template>
  <div class="flex-container">
    <div class="card">
      <h3>Total Pounds</h3>
      <p class="h--2">{{getTotalWeight}}</p>
    </div>
    <div class="card">
      <h3>Invoice</h3>
      <p class="h--2">${{getInvoice}}</p>
    </div>
    <div class="card">
      <h3>Avg $/CWT</h3>
      <p class="h--2">{{getAverageCost}}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'QuoteSummaryBase',
  computed: {
    getTotalWeight() {
      return this.$store.getters.getTotalWeight
    },
    getInvoice() {
      return this.$store.getters.getInvoice
    },
    getAverageCost() {
      return this.$store.getters.getAverageCost
    },
  }
}
</script>

<style scoped>

.h--2 {
  font-size: 36px;
  font-weight: 700;
  margin: 0;
}

.flex-container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 80px;
}

.card {
  height: 120px;
  border: solid 2px black;
  border-radius: 8px;
  background-color: darkgrey;
  padding: 8px 16px;
  color: white;
}
</style>