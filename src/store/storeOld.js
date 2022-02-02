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
            const { prices, weights, count } = params

            var averageCost=0, totalCost = 0;
            prices.forEach((price, index) => {
                if (price) {
                    averageCost+=price
                    totalCost+= (weights[index]/100)* price
                }
            })

            if (count) {
                averageCost=averageCost/count
            }

            state.averageCost = averageCost.toFixed(2)
            state.invoice = totalCost.toFixed(2)

            var totalWeight = 0;
            weights.forEach(weight => {
                if (weight) {
                    totalWeight+=weight
                }
            })
            state.totalWeight = totalWeight

        },
    },
})