<template>
  <svg>
    <g class="map-group">
      <g v-for="(state, i) in stateShapes" :key="'state-'+i.toString()" class="usa-map-group">
        <path v-for="(part, j) in state.geometry.coordinates" :key="'state-part-'+j.toString()" :d="processCoords(state.geometry.type, part)"></path>
      </g>
    </g>
    <g class="center-points">
      <circle v-for="(c, i) in circles" :key="'circle-'+i.toString()" :cx="c.x" :cy="c.y" r="1" fill="#ff0000"></circle>
    </g>
  </svg>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      stateShapes: [],
      circles: []
    }
  },
  methods: {
    processCoords: function (t, g) {
      let coordString = ''
      // console.log(t)
      // console.log(g)
      let i = 0
      let j = 0
      if (t === 'Polygon') {
        for (i = 0; i < g.length; i++) {
          let letter = i === 0 ? 'M ' : ' L '
          coordString += letter + (g[i][0] * 5).toString() + ' ' + (g[i][1] * -6).toString()
        }
        coordString += ' Z'
      } else {
        for (i = 0; i < g.length; i++) {
          for (j = 0; j < g[i].length; j++) {
            let letter = j === 0 ? 'M ' : ' L '
            coordString += letter + (g[i][j][0] * 5).toString() + ' ' + (g[i][j][1] * -6).toString()
          }
          coordString += ' Z '
        }
      }
      return coordString
    },
    getCenter: function (el) {
      return {x: el.getBoundingClientRect().left + (el.getBoundingClientRect().width / 2), y: el.getBoundingClientRect().top + (el.getBoundingClientRect().height / 2)}
    }
  },
  mounted: function () {
    let self = this
    axios.get('/src/assets/usa_geo.json').then((response) => {
      // console.log(response.data.features)
      self.$data.stateShapes = response.data.features
    })
    setTimeout(function () {
      let stateElements = document.querySelectorAll('svg > g > g.usa-map-group')
      for (let i = 0; i < stateElements.length; i++) {
        self.$data.circles.push(self.getCenter(stateElements[i]))
      }
      // console.log(self.$data.circles)
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
svg{
  width: 500px;
  height: 500px;
  > g.map-group{
    transform: translate(700px, 330px);
  }
  > g.center-points{
    transform: translate(0px, -145px)
  }
}
</style>


