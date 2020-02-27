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
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: _keys,
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                barWidth: '60%',
                name: self.hovertitle,
                type: 'bar',
                data: _values
              }
            ]
          }
          co.setOption(option)
        }
      }
    }
  }
</script>