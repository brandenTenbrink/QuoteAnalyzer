import Vuex from 'vuex'

import { shallowMount } from '@vue/test-utils'
import AnalyzerBase from '@/components/Analyzer/AnalyzerBase.vue';

const partsList = [
  {
    Location: "Cleveland, Ohio",
    PartNo: '12345',
    Product: 'Part 1',
    Weight: 4000000,
    Quotes: [
      {
        Company: "BSC",
        FinalPrice: 32,
        PackagingFee: 0.5,
        FreightFee: 1.54,
      }
    ]
  }
]

const store = {

}

let wrapper 

describe('QuoteAnalyzer.vue', () => {
  beforeEach(() => {
    wrapper = shallowMount(AnalyzerBase, {
      props: {
        partsList: partsList
      },
      mocks: {
        $store: store,
      }
    })
  })
  it('rendered the price dropdown', () => {
    const select = wrapper.find('select')
    expect(select.exists()).toBe(true)
  })
})