<template>
  <table>
    <tr class="property-header">
      <td colspan="2">
        Position
      </td>
    </tr>
    <tr>
      <td>X</td><td><input type="number" v-model="object.position.x" v-on:change="onInput" /></td>
    </tr>
    <tr>
      <td>Y</td><td><input type="number" v-model="object.position.y" v-on:change="onInput" /></td>
    </tr>
    <tr>
      <td>Z</td><td><input type="number" v-model="object.position.z" v-on:change="onInput" /></td>
    </tr>
    <tr class="property-header">
      <td colspan="2">
        Rotation
      </td>
    </tr>
    <tr>
      <td>X</td><td><input type="number" v-model="object.rotation.x" v-on:change="onInput" /></td>
    </tr>
    <tr>
      <td>Y</td><td><input type="number" v-model="object.rotation.y" v-on:change="onInput" /></td>
    </tr>
    <tr>
      <td>Z</td><td><input type="number" v-model="object.rotation.z" v-on:change="onInput" /></td>
    </tr>
    <tr class="property-header">
      <td colspan="2">
        Scale
      </td>
    </tr>
    <tr>
      <td>X</td><td><input type="number" v-model="object.scale.x" v-on:change="onInput" /></td>
    </tr>
    <tr>
      <td>Y</td><td><input type="number" v-model="object.scale.y" v-on:change="onInput" /></td>
    </tr>
    <tr>
      <td>Z</td><td><input type="number" v-model="object.scale.z" v-on:change="onInput" /></td>
    </tr>
    <tr class="property-header" v-if="object.ratio != undefined && object.ratio != null">
      <td>Ratio</td><td><input type="number" v-model="object.ratio" redraw="yes" v-on:change="onInput" /></td>
    </tr>
    <tr class="property-header" v-if="object.points != undefined && object.points != null && index >= 0">
      <td colspan="2">Points</td>
    </tr>
    <tr v-for="(p, i) in object.points" :key="'point_'+i.toString()" v-if="object.points != undefined && object.points != null && index >= 0">
      <td>Point {{i + 1}}</td>
      <td>
        <table>
          <tr>
            <td><input :pointid="index.toString()+':'+i.toString() + ':x'" type="number" :value="object.points[i].x" redraw="yes" v-on:change="onPointInput" /></td>
            <td><input :pointid="index.toString()+':'+i.toString() + ':y'" type="number" :value="object.points[i].y" redraw="yes" v-on:change="onPointInput" /></td>
            <td v-if="object.points[i].z != undefined && object.points[i].z != null"><input :pointid="index.toString()+':'+i.toString() + ':z'" type="number" :value="object.points[i].z" redraw="yes" v-on:change="onPointInput" /></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="object.points != undefined && object.points != null && index >= 0">
      <td colspan="2"><button v-on:click="addPoint">Add Point</button></td>
    </tr>
  </table>
</template>
<script>
import {EventBus} from './EventBus.js'
export default {
  props: ['object', 'index'],
  data () {
    return {
    }
  },
  methods: {
    onInput: function (e) {
      var shouldRedraw = e.currentTarget.getAttribute('redraw') === 'yes'
      EventBus.$emit('editor-value-change', shouldRedraw)
    },
    onPointInput: function (e) {
      // var shouldRedraw = e.currentTarget.getAttribute('redraw') === 'yes'
      var pointSplit = e.currentTarget.getAttribute('pointid').split(':')
      var pointParams = {o: Number(pointSplit[0]), p: Number(pointSplit[1]), prop: pointSplit[2], value: e.currentTarget.value}
      EventBus.$emit('editor-point-change', pointParams)
    },
    addPoint: function () {
      EventBus.$emit('editor-point-add', this.index)
    },
    hasProperty: function (p) {
      return p !== null && p !== undefined
    }
  }
}
</script>

<style lang="scss" scoped>
table{
  width:100%;
  tr.property-header {
    font-weight: bold;
  }
  tr:not(.property-header){
    > td{
      width:50%;
      > input[type="number"]{
        width:100%;
      }
    }
  }
  tr.util-ui-row{
    td{
      > button.delete{
        float:right;
      }

    }
  }
}
</style>
