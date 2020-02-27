<template>
  <div class="echarts-chart">
    <div v-bind:id="chartid"></div>
  </div>
</template>
<script>
  import BaseChart from './BaseChart.js'
  export default {
    extends: BaseChart,
    methods: {
      buildChart: function (co) {
        var self = this
        if (document.getElementById(self.$data.chartid) !== undefined) {
          var _data = []
          var _values = []
          var _keys = []
          // console.log(self.chartdata)
          for (var k in self.chartdata) {
            _keys.push(k)
            _values.push(self.chartdata[k])
            _data.push({name: k, value: self.chartdata[k]})
          }
          var option = {
            title: {
              text: self.title,
              textStyle: {
                color: self.textcolor
              },
              x: 'left'
            },
            color: self.colors,
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series: [
              {
                name: self.hovertitle,
                type: 'pie',
                radius: ['50%', '70%'],
                selectedMode: 'single',
                clockwise: true,
                label: {
                  normal: {
                    textStyle: {
                      fontSize: 12,
                      color: self.textcolor
                    }
                  }
                },
                labelLine: {
                  normal: {
                    lineStyle: {
                      color: self.textcolor
                    }
                  }
                },
                data: _data
              }
            ]
          }
          co.setOption(option)
        }
      }
    }
  }
</script>
