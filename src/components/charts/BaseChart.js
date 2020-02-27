import echarts from 'echarts'
export default {
  data () {
    return {
      chartid: 'CHART_' + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join(''),
      chartObject: undefined
    }
  },
  props: ['chartdata', 'colors', 'textcolor', 'title', 'hovertitle'],
  methods: {
    buildChart: function (co) {
    }
  },
  mounted: function () {
    var self = this
    self.$data.chartObject = echarts.init(document.getElementById(self.$data.chartid))
    setTimeout(function () {
      self.buildChart(self.$data.chartObject)
    }, 1000)
  }
}
