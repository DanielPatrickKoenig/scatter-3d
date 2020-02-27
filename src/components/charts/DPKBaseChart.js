import Utilties from '../utils/Utilities.js'
export default {
  props: ['values', 'details', 'uid'],
  data () {
    return {
      chartID: 'bar-chart-' + Math.random().toString().split('.').join('') + '-' + Math.random().toString().split('.').join('') + '-' + Math.random().toString().split('.').join(''),
      ready: false,
      wide: 1,
      high: 1,
      ratios: [],
      sideLabels: [],
      chartColors: Utilties.ChartColors,
      chartMax: 1
    }
  },
  methods: {
    renderChart: function () {
      let self = this
      self.$data.wide = document.getElementById(this.$data.chartID).parentNode.getBoundingClientRect().width
      self.$data.high = document.getElementById(this.$data.chartID).parentNode.getBoundingClientRect().height
    },
    collectRatios: function () {
      let self = this
      let _ratios = []
      let j = 0
      let i = 0
      let output = []
      if (self.values.length > 0) {
        if (self.values[0].value.join) {
          let highestVals = []
          for (i = 0; i < self.values.length; i++) {
            _ratios.push([])
            for (j = 0; j < self.values[i].value.length; j++) {
              _ratios[i].push(self.values[i].value[j])
            }
            highestVals.push(Utilties.getHighest(_ratios[i]))
          }
          let highest = Utilties.getHighest(highestVals)
          let factoredValues = []
          for (i = 0; i < _ratios.length; i++) {
            factoredValues.push(Utilties.getRatios(_ratios[i], highest))
          }
          output = factoredValues
        } else {
          for (i = 0; i < self.values.length; i++) {
            _ratios.push(self.values[i].value)
          }
          let denom = 1
          self.$data.chartMax = denom
          for (i = 0; i < Utilties.getHighest(_ratios, true); i += denom) {
            self.$data.sideLabels.push(i)
          }
          output = Utilties.getRatios(_ratios)
        }
      }
      return output
    },
    getLiveHeight: function () {
      let self = this
      return self.$data.high - 30
    },
    renderPath: function (ratio, index) {
    },
    getMargins: function () {
      return {
        left: 20,
        right: 20,
        bottom: 20,
        top: 20
      }
    },
    getLiveBounds: function () {
      return {
        x: this.getMargins().left,
        y: this.getMargins().top,
        width: this.wide - (this.getMargins().left + this.getMargins().right),
        height: this.high - (this.getMargins().top + this.getMargins().bottom)
      }
    }
  },
  watch: {
    uid: function () {
      let self = this
      self.renderChart()
    }
  },
  mounted: function () {
    let self = this
    self.renderChart()
    self.$data.ratios = self.collectRatios()
    console.log(self.$data.ratios)
  }
}
