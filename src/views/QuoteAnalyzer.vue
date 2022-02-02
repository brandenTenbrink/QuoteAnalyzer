<template>
  <div>
    <QuoteSummaryBase :part-summary="getPartsSummary" />
    <AnalyzerBasev2 :parts-list="getPartsList" />
  </div>
</template>

<script>
import AnalyzerBasev2 from '../components/Analyzer/AnalyzerBasev2.vue'
import QuoteSummaryBase from '../components/QuoteSummary/QuoteSummaryBase.vue'

export default {
  name: 'QuoteAnalyzer',
  components: {
    AnalyzerBasev2,
    QuoteSummaryBase,
  },
  created() {
    this.$store.dispatch('getPartsList')
  },
  computed: {
    getPartsList() {
      return this.$store.getters.getPartsList
    },
  }
}
</script>

