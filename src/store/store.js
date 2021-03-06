import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
    state: {
        partsList: [],
        totalWeight: 0,
        invoice: 0,
        averageCost: 0,
    },
    getters: {
        getPartsList: state => {
            return state.partsList
        },
        getPartsSummary: state => {
            return state.partsSummary
        },
        getTotalWeight: state => {
            return state.totalWeight
        },
        getInvoice: state => {
            return state.invoice
        },
        getAverageCost: state => {
            return state.averageCost
        }
    },
    actions: {
        getPartsList(context) {
            axios
            .get('datasample.json')
            .then(response => {
                context.commit('setPartsList', response.data)
            })
            .catch(err => console.log(err))
        },
        updateQuoteSummary(context, params) {
            context.commit('updateQuoteSummary', params)
        }
    },
    mutations: {
        setPartsList(state, partsList) {
            state.partsList = partsList
        },
        updateQuoteSummary(state, params) {
            const { selections, type, count } = params
            const partsList = state.partsList;

            let averageCost=0, totalCost = 0, totalWeight = 0;
            selections.forEach((row, rowIndex) => {
                row.forEach((selection, columnIndex) => {
                    const price = partsList[rowIndex].Quotes[columnIndex][type]
                    const weight = partsList[rowIndex].Weight

                    if (selection) {
                        averageCost+= price
                        totalCost+= (weight/100)* price
                        totalWeight+= weight
                    }
                })
            })

            if (count) {
                averageCost=averageCost/count
            }

            state.averageCost = averageCost.toFixed(2)
            state.invoice = totalCost.toFixed(2)
            state.totalWeight = totalWeight

        },
    },
})