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
        <template v-for="(quote, quoteIndex) in part.Quotes" :key="quoteIndex + quote.FinalPrice">
            <td 
              :class="[
                determineTextColor(quote[this.activePriceType], part.Quotes), 
                isSelected(partIndex, quoteIndex)
              ]" 
              v-on:click="selectPrice(partIndex, quoteIndex )" 
            >
              {{quote[this.activePriceType].toFixed(2)}}
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
      activePriceType: 'FinalPrice',
      selectOptions: [
        'Final Prices',
        'Freight Fees',
        'Packaging Fees'
      ],
      selectedPrices: [[],[]],
      selectedCount: 0
    }
  },
  props: {
      partsList: { type: Array , default: () => []}
  },
  created() {
    this.selectedPrices = this.createAndFillSelectedPricesArray()
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
    createAndFillSelectedPricesArray() {
      const rows = this.partsList.length
      const columns = this.partsList[0].Quotes.length
      const defaultValue = false;

      return Array.from({ length:rows }, () => (
        Array.from({ length:columns }, ()=> defaultValue)
      ))
    },
    determineTextColor(price, quotes) {
      const prices = quotes.map(quote => {
        return quote[this.activePriceType]
      })

      const min = Math.min.apply(Math, prices)
      const max = Math.max.apply(Math, prices)

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
    isSelected(rowIndex, columnIndex) {
      if (this.selectedPrices[rowIndex][columnIndex]) {
        return 'index--selected'
      }
    },
    onFeeSelection(event) {
      const feeType = event.target.value;

      switch(feeType) {
        case 'Final Prices':
          this.activePriceType = 'FinalPrice'
          this.updateSelectedPrices();
          break
        case 'Packaging Fees':
          this.activePriceType = 'PackagingFee'
          this.updateSelectedPrices();
          break
        case 'Freight Fees':
          this.activePriceType = 'FreightFee'
          this.updateSelectedPrices();
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
    selectPrice(rowIndex, columnIndex) {
        if (this.selectedPrices[rowIndex][columnIndex]) {
          this.selectedPrices[rowIndex][columnIndex] = false
          this.selectedCount--
        }
        else {
          const existingSelection = this.selectedPrices[rowIndex].indexOf(true)
          if (existingSelection !== -1) {
            this.selectedPrices[rowIndex][existingSelection] = false
          } else {
            this.selectedPrices[rowIndex][columnIndex] = true
            this.selectedCount++
          }
        } 
        this.$store.dispatch('updateQuoteSummary', { selections: this.selectedPrices, type: this.activePriceType, count: this.selectedCount })
    },
    updateSelectedPrices() {
      this.$store.dispatch('updateQuoteSummary', { selections: this.selectedPrices, type: this.activePriceType, count: this.selectedCount })
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