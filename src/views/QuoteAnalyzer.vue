<template>
  <div>
    <QuoteSummaryBase :part-summary="getPartsSummary" />
    <AnalyzerBase :parts-list="getPartsList" />
  </div>
</template>

<script>
import AnalyzerBase from '../components/Analyzer/AnalyzerBase.vue'
import QuoteSummaryBase from '../components/QuoteSummary/QuoteSummaryBase.vue'

export default {
  name: 'QuoteAnalyzer',
  components: {
    AnalyzerBase,
    QuoteSummaryBase,
  },
  created() {
    this.$store.dispatch('getPartsList')
  },
  computed: {
    getPartsList() {
      return this.$store.getters.getPartsList
    },
    getPartsSummary() {
      return this.$store.getters.getPartsSummary
    }
  }
}
</script>

