<template>
  <QuoteAnalyzer />
</template>

<script>
import QuoteAnalyzer from './views/QuoteAnalyzer.vue'

export default {
  name: 'App',
  components: {
    QuoteAnalyzer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
