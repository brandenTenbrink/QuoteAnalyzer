<template>
  <div class="analysis-container">
    <select class="select" name="fees" @change="onFeeSelection($event)">
      <template v-for="option in selectOptions" :key="option">
        <option :value="option">{{option}}</option>
      </template>
    </select>
    <table class="analysis-table">
      <tr>
        <template v-for="name in tableHeaderNames" :key="name">
        <th>{{name}}</th>
        </template>
      </tr>
      <tr class="" v-for="(part, partIndex) in partsList" :key="part.Product">
        <td>{{part.Location}}</td>
        <td>{{part.PartNo}}</td>
        <td>{{part.Product}}</td>
        <td>{{part.Weight}}</td>
        <template v-for="(price, priceIndex) in activePrices[partIndex]" :key="priceIndex + price">
            <td 
              :class="[
                determineTextColor(price, activePrices[partIndex]), 
                isSelected(priceIndex, partIndex)
              ]" 
              v-on:click="selectPrice(priceIndex, partIndex, price, part.Weight)" 
            >
              {{price.toFixed(2)}}
            </td>
        </template>
      </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: 'AnalyzerBase',
  data() {
    return {
      activePrices: [],
      finalPrices: [],
      freightFees: [],
      packagingFees: [],
      selectOptions: [
        'Final Prices',
        'Freight Fees',
        'Packaging Fees'
      ],
      selectedIndices: [],
      selectedPrices: [],
      selectedWeights: [],
      selectedCount: 0
    }
  },
  props: {
      partsList: { type: Array , default: () => []}
  },
  created() {
    const finalPrices = this.generatePricingArray('FinalPrice')
    this.finalPrices = finalPrices
    this.activePrices = finalPrices

    this.freightFees = this.generatePricingArray('FreightFee')
    this.packagingFees = this.generatePricingArray('PackagingFee')

    this.selectedIndices = new Array(this.partsList.length).fill(undefined)
    this.selectedPrices = new Array(this.partsList.length).fill(undefined)
    this.selectedWeights = new Array(this.partsList.length).fill(undefined)
  },
  computed: {
    getQuotes() {
      return this.partsList.map(part => {
        return part.Quotes
      })
    },
    getPartsInfo() {
      return this.partsList.map(part => {
        return {
          Location: part.Location,
          PartNo: part.PartNo,
          Product: part.Product,
          Weight: part.Weight,
        }
      })
    },
    tableHeaderNames() {
      return this.parseTableHeaderNames()
    },
  },
  methods: {
    determineTextColor(price, priceArray) {
      const min = Math.min.apply(Math, priceArray)
      const max = Math.max.apply(Math, priceArray)

      if (price === min)
        return 'text--green'
      else if (price === max)
        return 'text--red'
      else 
        return
    },
    generatePricingArray(name) {
      const parsedPrices = this.getQuotes.map(quote => {
        return quote.map(price => {
          return price[name]
        })
      })
      return parsedPrices
    },
    isSelected(position, index) {
      if (position === this.selectedIndices[index]) 
        return 'index--selected'
    },
    onFeeSelection(event) {
      const feeType = event.target.value;

      switch(feeType) {
        case 'Final Prices':
          this.activePrices = this.finalPrices
          this.updateSelectedPrices(this.finalPrices);
          break
        case 'Packaging Fees':
          this.activePrices = this.packagingFees
          this.updateSelectedPrices(this.packagingFees);
          break
        case 'Freight Fees':
          this.activePrices = this.freightFees
          this.updateSelectedPrices(this.freightFees);
          break
        default:
          break
      }
    },
    parseTableHeaderNames() {
      const initialPartsObject = this.getPartsInfo[0]
      const initialQuotes = this.getQuotes[0]

      const headerNames = Object.keys(initialPartsObject)
      initialQuotes.forEach(quote => {
        headerNames.push(quote.Company)
      })

      return headerNames
    },
    selectPrice(priceIndex, partIndex, price, weight) {
        if (priceIndex === this.selectedIndices[partIndex]) {
          this.selectedIndices.splice(partIndex, 1, undefined)
          this.selectedPrices.splice(partIndex, 1, undefined)
          this.selectedWeights.splice(partIndex, 1, undefined)
          this.selectedCount--
        }
        else {
          if (this.selectedIndices[partIndex] === undefined) {
            this.selectedCount++
          }
          this.selectedIndices.splice(partIndex, 1, priceIndex)
          this.selectedPrices.splice(partIndex, 1, price)
          this.selectedWeights.splice(partIndex, 1, weight)
        } 
        this.$store.dispatch('updateQuoteSummary', { prices: this.selectedPrices, weights: this.selectedWeights, count: this.selectedCount })
    },
    updateSelectedPrices(newPrices) {
      const updatedPrices = this.selectedPrices.map((price, index) => {
        return newPrices[index][this.selectedIndices[index]]
      })
      this.selectedPrices = updatedPrices

      this.$store.dispatch('updateQuoteSummary', { prices: this.selectedPrices, weights: this.selectedWeights, count: this.selectedCount })
    }
  }
}
</script>

<style scoped>
table {
  border: solid 2px #000;
  border-collapse: collapse;
}

tr {
  border: none;
}

tr:nth-child(odd) {
  background-color: #f6f6f6;
}

td, th {
  border-right: solid 2px #000;
  border-left: solid 2px #000;
  text-align: left;
  padding: 8px 16px;
}

.analysis-container {
  max-width: 80%;
  margin: 0 auto;
  text-align:right;
}

.analysis-table {
  margin-top: 16px;
  width: 100%;
}

.index--selected {
  background-color: lightsalmon;
}

.select {
  padding: 8px 16px;
}

.text--default {
  color: inherit;
}

.text--green {
  color: green;
}

.text--red {
  color: red;
}
</style>