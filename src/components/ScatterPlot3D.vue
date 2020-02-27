<template>
  <div class="view-shell">
    <div v-if="valMatrix.length >= 3" class="view-container" :id="containerID">
    </div>
    <wireframe :objects="objects" :axis="axis" :scale="axisData.scale"></wireframe>
    <ul class="view-menu">
      <li>
        <button v-on:click="setViewMode(2)">2D</button>
        <button v-on:click="setViewMode(3)">3D</button>
      </li>
      <!-- <li>
        <select v-model="metricIndexes[0]" v-on:change="shiftObjects">
          <option v-for="(n, i) in valMatrix" :key="'a-' + i.toString()" :value="i">
            {{labels[i]}}
          </option>
        </select>
        <select v-model="metricIndexes[1]" v-on:change="shiftObjects">
          <option v-for="(n, i) in valMatrix" :key="'b-' + i.toString()" :value="i">
            {{labels[i]}}
          </option>
        </select>
        <select v-model="metricIndexes[2]" v-on:change="shiftObjects">
          <option v-for="(n, i) in valMatrix" :key="'c-' + i.toString()" :value="i">
            {{labels[i]}}
          </option>
        </select>f
      </li> -->
    </ul>
    <ul class="filter-menu">
      <li v-for="(v, i) in valKeys" :key="v + '-' + i.toString()">
        <filterbuild :enabled="laodedData != null && valMatrix.length >= i" :stats="laodedData" :t1="v" :index="i" v-on:confirm="filterConfirmed" :startteir="startTeirs[i] ? startTeirs[i] : null">
          <span :style="'font-weight: bold;' + filterSlots[i].style">{{filterSlots[i].content}}</span>
        </filterbuild>
      </li>
    </ul>
    <div v-if="toolTipPosition.shown" class="scp3-tool-tip" :style="'top:' + toolTipPosition.y + 'px;left:' + toolTipPosition.x + 'px;'">
      {{toolTipPosition.content}}
    </div>
  </div>
</template>
<script>
import {ObjectTypes} from './ObjectTypes.js'
import {AxisTypes} from './AxisTypes.js'
import SingleAxisWireFrame from './SingleAxisWireFrame.vue'
import {TweenLite} from 'gsap'
import DataSlicer from './utils/DataSlicer.js'
import FilterBuilder from './FilterBuilder.vue'
export default {
  props: ['chartdata', 'perspective', 'distfactor', 'axis', 'signature', 'colors', 'labels', 'select'],
  components: {
    wireframe: SingleAxisWireFrame,
    filterbuild: FilterBuilder
  },
  data () {
    return {
      containerID: 'el_' + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join(''),
      THREE: require('three'),
      renderer: {},
      scene: {},
      camera: {},
      ObjectTypes: ObjectTypes,
      axisData: {
        axis: this.axis,
        scale: 8
      },
      sig: this.signature,
      meshes: [],
      camTarget: {x: 0, y: 0, z: 0},
      camPos: {x: -3 * this.distfactor, y: 2 * this.distfactor, z: -5 * this.distfactor},
      metricIndexes: [0, 1, 2],
      points: [],
      crossSectionBox: null,
      viewMode: 3,
      currentIndex: -1,
      lineMatrix: {
        X: {listA: [], listB: [], scale: 1},
        Y: {listA: [], listB: [], scale: 1},
        Z: {listA: [], listB: [], scale: 1},
        XLABEL: null,
        YLABEL: null,
        ZLABEL: null,
        NUMBER_LABELS: []
      },
      didSelect: this.select,
      offset: {x: 0, y: 0},
      maxVal: 5,
      laodedData: null,
      valKeys: [],
      allKeys: [],
      valMatrix: JSON.parse(JSON.stringify(this.chartdata)),
      cd: this.chartdata,
      initalized: false,
      filterSlots: [
        {content: 'X Axis', style: 'color:#00aeef'},
        {content: 'Y Axis', style: 'color:#f26d7d'},
        {content: 'Z Axis', style: 'color:#7cc576'},
        {content: 'Size', style: ''},
        {content: 'Opacity', style: ''}
      ],
      startTeirs: ['Fit with Brand Chrysler', 'Fit with Brand Dodge', 'Fit with Brand Jeep'],
      toolTipPosition: {x: 0, y: 0, shown: false, content: ''}
    }
  },
  watch: {
    select: function () {
      let self = this
      // console.log(self.select)
      self.$data.didSelect = self.select
      self.positionCrossSectionBox()
      self.redraw()
    }
  },
  methods: {
    filterConfirmed: function (e) {
      let self = this
      let list = []
      for (let d in self.$data.laodedData) {
        // console.log(e.keys)
        let items = DataSlicer.objectValues(DataSlicer.slice(e.keys, self.$data.laodedData[d]), [])
        let sum = 0
        for (let j = 0; j < items.length; j++) {
          sum += items[j]
        }
        list.push(sum / items.length)
      }
      if (self.$data.valMatrix[e.index] !== undefined) {
        self.$data.valMatrix.splice(e.index, 1)
      }
      self.$data.valMatrix.splice(e.index, 0, list)
      // console.log(e.index)
      // console.log(self.$data.valMatrix)
      if (self.$data.valMatrix.length >= 3 && !self.$data.initalized) {
        setTimeout(self.initualize, 100)
      } else {
        self.shiftObjects()
        setTimeout(self.updateLabels, 200)
      }
      // console.log(self.$data.valMatrix)
      self.$emit('data-update', self.$data.valMatrix)
    },
    updateLabels: function () {
      let self = this
      self.$data.lineMatrix.XLABEL.material = self.makeTextMaterial(document.querySelector('#display-label-0 > span:last-child').innerHTML, {color: self.colors[0]})
      self.$data.lineMatrix.YLABEL.material = self.makeTextMaterial(document.querySelector('#display-label-1 > span:last-child').innerHTML, {color: self.colors[1]})
      self.$data.lineMatrix.ZLABEL.material = self.makeTextMaterial(document.querySelector('#display-label-2 > span:last-child').innerHTML, {color: self.colors[2]})
    },
    createCrossSectionBox: function (color) {
      let self = this
      let THREE = self.$data.THREE
      let geometry = new THREE.BoxBufferGeometry(1, 1, 1, 32, 32, 32)
      let material = new THREE.MeshBasicMaterial({color: color})
      let wireframe = new THREE.EdgesGeometry(geometry)
      let line = new THREE.LineSegments(wireframe, material)
      line.material.depthTest = false
      line.material.opacity = 1
      line.material.transparent = true
      self.$data.scene.add(line)
      return line
    },
    getPointColor: function (index) {
      let self = this
      let highest = -1000000
      let highIndex = -1
      for (let i = 0; i < self.$data.metricIndexes.length; i++) {
        if (self.$data.valMatrix[self.$data.metricIndexes[i]][index] > highest) {
          highest = self.$data.valMatrix[self.$data.metricIndexes[i]][index]
          highIndex = i
        }
      }
      // console.log(self.colors[highIndex])
      return self.colors[highIndex]
    },
    roundRect: function (ctx, x, y, w, h, r) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    },
    makeTextMaterial: function (message, parameters) {
      let self = this
      let THREE = self.$data.THREE
      if (parameters === undefined) parameters = {}
      var fontface = parameters.hasOwnProperty('fontface') ? parameters['fontface'] : 'Arial'
      var fontsize = parameters.hasOwnProperty('fontsize') ? parameters['fontsize'] : 25
      var borderThickness = parameters.hasOwnProperty('borderThickness') ? parameters['borderThickness'] : 4
      var borderColor = parameters.hasOwnProperty('borderColor') ? parameters['borderColor'] : {r: 0, g: 0, b: 0, a: 0}
      var backgroundColor = parameters.hasOwnProperty('backgroundColor') ? parameters['backgroundColor'] : {r: 255, g: 255, b: 255, a: 0}
      // var spriteAlignment = THREE.SpriteAlignment.topLeft
      var canvas = document.createElement('canvas')
      var context = canvas.getContext('2d')
      // document.querySelector('body').appendChild(canvas)
      context.font = 'Bold ' + fontsize + 'px ' + fontface
      // var metrics = context.measureText(message)
      // var textWidth = 1000
      context.fillStyle = 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ',' + backgroundColor.b + ',' + backgroundColor.a + ')'
      context.strokeStyle = 'rgba(' + borderColor.r + ',' + borderColor.g + ',' + borderColor.b + ',' + borderColor.a + ')'
      context.lineWidth = borderThickness
      context.fillStyle = parameters.hasOwnProperty('color') ? parameters['color'] : 'rgba(0, 0, 0, 1.0)'
      let msgs = message.split('&gt;')
      for (var i = 0; i < msgs.length; i++) {
        context.fillText(msgs[i], borderThickness, (fontsize + borderThickness) * (i + 1))
      }
      var texture = new THREE.Texture(canvas)
      texture.needsUpdate = true
      return new THREE.SpriteMaterial({map: texture})
    },
    makeTextSprite: function (message, parameters) {
      let self = this
      let THREE = self.$data.THREE
      var sprite = new THREE.Sprite(self.makeTextMaterial(message, parameters))
      sprite.scale.set(2, 1, 1)
      self.$data.scene.add(sprite)
      return sprite
    },
    makeGridLine: function (at, ratio, max, lat) {
      let self = this
      let THREE = self.$data.THREE
      let phongMat = new THREE.MeshBasicMaterial({color: 0x333333})
      let geometry = new THREE.BoxBufferGeometry(1, 1, 1, 32, 32, 32)
      let mesh = new THREE.Mesh(geometry, phongMat)
      self.$data.scene.add(mesh)
      let smallScale = 0.02
      let largeScale = max
      switch (at) {
        case AxisTypes.X:
        {
          if (lat) {
            mesh.scale.y = largeScale
            mesh.scale.z = smallScale
            mesh.scale.x = smallScale
            mesh.position.x = (max * ratio) * -1
            mesh.position.y = largeScale / 2
          } else {
            mesh.scale.y = smallScale
            mesh.scale.z = smallScale
            mesh.scale.x = largeScale
            mesh.position.y = max * ratio
            mesh.position.x = largeScale / -2
          }
          break
        }
        case AxisTypes.Y:
        {
          if (lat) {
            mesh.scale.x = smallScale
            mesh.scale.z = largeScale
            mesh.scale.y = smallScale
            mesh.position.y = max * ratio
            mesh.position.z = largeScale / -2
          } else {
            mesh.scale.x = smallScale
            mesh.scale.z = smallScale
            mesh.scale.y = largeScale
            mesh.position.z = max * ratio * -1
            mesh.position.y = largeScale / 2
          }
          break
        }
        case AxisTypes.Z:
        {
          if (lat) {
            mesh.scale.x = largeScale
            mesh.scale.y = smallScale
            mesh.scale.z = smallScale
            mesh.position.z = max * ratio * -1
            mesh.position.x = largeScale / -2
          } else {
            mesh.scale.x = smallScale
            mesh.scale.y = smallScale
            mesh.scale.z = largeScale
            mesh.position.x = max * ratio * -1
            mesh.position.z = largeScale / -2
          }
          break
        }
      }
      self.$data.scene.add(mesh)
      return mesh
    },
    createSphere: function (index) {
      let self = this
      let THREE = self.$data.THREE
      let phongMat = new THREE.MeshLambertMaterial({color: Number('0x' + self.getPointColor(index).split('#')[1]), transparent: true, opacity: 1})
      // let phongMat = new THREE.MeshPhongMaterial({color: Number('0x' + self.getPointColor(index).split('#')[1]), specular: Number('0x' + self.getPointColor(index).split('#')[1])})
      // let phongMat = new THREE.MeshBasicMaterial({color: Number('0x' + self.getPointColor(index).split('#')[1])})
      let geometry = new THREE.SphereBufferGeometry(1)
      let mesh = new THREE.Mesh(geometry, phongMat)
      self.$data.scene.add(mesh)
      mesh.addEventListener('click', function (e) {
        // console.log(e)
      })
      return mesh
    },
    createGrid: function () {
      let self = this
      let count = 5
      for (let i = 0; i <= count; i++) {
        self.$data.lineMatrix.X.listA.push(self.makeGridLine(AxisTypes.X, i / count, self.$data.maxVal))
        self.$data.lineMatrix.X.listB.push(self.makeGridLine(AxisTypes.X, i / count, self.$data.maxVal, true))
        self.$data.lineMatrix.Y.listA.push(self.makeGridLine(AxisTypes.Y, i / count, self.$data.maxVal))
        self.$data.lineMatrix.Y.listB.push(self.makeGridLine(AxisTypes.Y, i / count, self.$data.maxVal, true))
        self.$data.lineMatrix.Z.listA.push(self.makeGridLine(AxisTypes.Z, i / count, self.$data.maxVal))
        self.$data.lineMatrix.Z.listB.push(self.makeGridLine(AxisTypes.Z, i / count, self.$data.maxVal, true))
        // self.makeGridLine(AxisTypes.X, i / count, 5)
        // self.makeGridLine(AxisTypes.X, i / count, 5, true)
        // self.makeGridLine(AxisTypes.Y, i / count, 5)
        // self.makeGridLine(AxisTypes.Y, i / count, 5, true)
        // self.makeGridLine(AxisTypes.Z, i / count, 5)
        // self.makeGridLine(AxisTypes.Z, i / count, 5, true)
      }
      self.$data.lineMatrix.X.listA[count].scale.y = 0.06
      self.$data.lineMatrix.X.listA[count].scale.z = 0.06
      self.$data.lineMatrix.X.listA[count].material.color.setHex(Number('0x' + self.colors[0].split('#')[1]))
      self.$data.lineMatrix.X.listA[count].name = 'axis'
      self.$data.lineMatrix.Y.listA[count].scale.x = 0.06
      self.$data.lineMatrix.Y.listA[count].scale.z = 0.06
      self.$data.lineMatrix.Y.listA[count].material.color.setHex(Number('0x' + self.colors[1].split('#')[1]))
      self.$data.lineMatrix.Y.listA[count].name = 'axis'
      self.$data.lineMatrix.Z.listA[count].scale.x = 0.06
      self.$data.lineMatrix.Z.listA[count].scale.y = 0.06
      self.$data.lineMatrix.Z.listA[count].material.color.setHex(Number('0x' + self.colors[2].split('#')[1]))
      self.$data.lineMatrix.Z.listA[count].name = 'axis'
    },
    createBoxFrame: function () {
      let self = this
      let THREE = self.$data.THREE
      let geometry = new THREE.BoxBufferGeometry(1, 1, 1, 32, 32, 32)
      let material = new THREE.MeshBasicMaterial({color: 0xcc0000})
      let wireframe = new THREE.EdgesGeometry(geometry)
      let line = new THREE.LineSegments(wireframe, material)
      line.material.depthTest = false
      line.material.opacity = 1
      line.material.transparent = true
      self.$data.scene.add(line)
      return line
    },
    renderObjects: function () {
      // let self = this
      let self = this
      // let spriteOffset = {x: 0.9, y: 0.3, z: 0.15}
      // console.log(self.$data.valMatrix)
      self.$data.crossSectionBox = self.createCrossSectionBox(0x000000)
      self.$data.crossSectionBox.scale.x = 0
      self.$data.crossSectionBox.scale.y = 0
      self.$data.crossSectionBox.scale.z = 0
      for (let i = 0; i < self.$data.valMatrix[self.$data.metricIndexes[0]].length; i++) {
        let sphere = self.createSphere(i)
        let sphereScale = self.$data.valMatrix.length > 3 ? self.$data.valMatrix[4][i] : 1
        sphere.scale.x = 0.1 * sphereScale
        sphere.scale.y = 0.1 * sphereScale
        sphere.scale.z = 0.1 * sphereScale
        sphere.position.x = self.$data.valMatrix[self.$data.metricIndexes[0]][i] * -1
        sphere.position.y = self.$data.valMatrix[self.$data.metricIndexes[1]][i] * 1
        sphere.position.z = self.$data.valMatrix[self.$data.metricIndexes[2]][i] * -1
        sphere.name = 'point-' + i.toString()
        self.$data.points.push(sphere)
        /*
        let sprite = self.makeTextSprite('     ')
        sprite.position.x = (self.$data.valMatrix[self.$data.metricIndexes[0]][i] * -1) - spriteOffset.x
        sprite.position.y = (self.$data.valMatrix[self.$data.metricIndexes[1]][i] * 1) - spriteOffset.y
        sprite.position.z = (self.$data.valMatrix[self.$data.metricIndexes[2]][i] * -1) + spriteOffset.z
        */
      }
      let sprite1 = self.makeTextSprite(' ', {color: self.colors[1]})
      sprite1.position.x = 1
      sprite1.position.y = self.$data.maxVal - 0.3
      sprite1.position.z = (self.$data.maxVal * -1) - 1.2
      self.$data.lineMatrix.YLABEL = sprite1
      let sprite2 = self.makeTextSprite(' ', {color: self.colors[0]})
      sprite2.position.x = (self.$data.maxVal * -1) - 1.2
      sprite2.position.y = self.$data.maxVal - 0.3
      sprite2.position.z = 0
      self.$data.lineMatrix.XLABEL = sprite2
      let sprite3 = self.makeTextSprite(' ', {color: self.colors[2]})
      sprite3.position.x = (self.$data.maxVal * -1) - 1.2
      sprite3.position.y = -0.7
      sprite3.position.z = self.$data.maxVal * -1
      self.$data.lineMatrix.ZLABEL = sprite3
      self.$data.lineMatrix.NUMBER_LABELS = self.createNumberLabels(['0', '1', '2', '3', '4', '5'])
      self.createGrid()
      // self.makeTextSprite('sup')
      self.$data.renderer.render(self.$data.scene, self.$data.camera)
      self.updateLabels()
    },
    createNumberLabels: function (labels) {
      let self = this
      let labelList = []
      for (let i = 0; i < labels.length; i++) {
        let sprite1 = self.makeTextSprite(labels[i], {color: self.colors[1]})
        sprite1.position.x = -0.8
        sprite1.position.y = ((self.$data.maxVal / (labels.length - 1)) * i) - 0.3
        sprite1.position.z = self.$data.maxVal * -1
        sprite1.name = 'y'
        let sprite2 = self.makeTextSprite(labels[i], {color: self.colors[0]})
        sprite2.position.x = (((self.$data.maxVal / (labels.length - 1)) * i) + 0.9) * -1
        sprite2.position.y = self.$data.maxVal - 0.15
        sprite2.position.z = 0.4
        sprite2.name = 'x'
        let sprite3 = self.makeTextSprite(labels[i], {color: self.colors[2]})
        sprite3.position.x = (self.$data.maxVal * -1) - 1.2
        sprite3.position.y = -0.25
        sprite3.position.z = (((self.$data.maxVal / (labels.length - 1)) * i)) * -1
        sprite3.name = 'z'
        labelList.push(sprite1)
        labelList.push(sprite2)
        labelList.push(sprite3)
      }
      return labelList
    },
    shiftObjects: function () {
      let self = this
      for (let i = 0; i < self.$data.points.length; i++) {
        if (self.$data.valMatrix.length > 4) {
          let newVal = {opacity: (1 / 6) + (self.$data.valMatrix[4][i] * (1 / 6))}
          // console.log('------------------------------- 9999999999900000000000')
          // console.log(newVal)
          // self.$data.points[i].material.color.setHex(Number('0x' + self.getPointColor(i).split('#')[1]))
          TweenLite.to(self.$data.points[i].material, 0.5, {
            opacity: newVal.opacity,
            onUpdate: function (index, last) {
              if (index === last) {
                self.redraw()
              }
            },
            onUpdateParams: [i, self.$data.points.length - 1]
          })
        }
        if (self.$data.valMatrix.length > 3) {
          let newVal = {x: 0.05 + (self.$data.valMatrix[3][i] * 0.1), y: 0.05 + (self.$data.valMatrix[3][i] * 0.1), z: 0.05 + (self.$data.valMatrix[3][i] * 0.1)}
          // console.log('------------------------------- 9999999999900000000000')
          // console.log(newVal)
          self.$data.points[i].material.color.setHex(Number('0x' + self.getPointColor(i).split('#')[1]))
          TweenLite.to(self.$data.points[i].scale, 0.5, {
            x: newVal.x,
            y: newVal.y,
            z: newVal.z,
            onUpdate: function (index, last) {
              if (index === last) {
                self.redraw()
              }
            },
            onUpdateParams: [i, self.$data.points.length - 1]
          })
        }
        let newPos = {x: self.$data.valMatrix[self.$data.metricIndexes[0]][i] * -1, y: self.$data.valMatrix[self.$data.metricIndexes[1]][i] * 1, z: self.$data.viewMode === 3 ? self.$data.valMatrix[self.$data.metricIndexes[2]][i] * -1 : 0}
        self.$data.points[i].material.color.setHex(Number('0x' + self.getPointColor(i).split('#')[1]))
        TweenLite.to(self.$data.points[i].position, 0.5, {
          x: newPos.x,
          y: newPos.y,
          z: newPos.z,
          onUpdate: function (index, last) {
            if (index === last) {
              self.redraw()
              self.positionCrossSectionBox()
            }
          },
          onUpdateParams: [i, self.$data.points.length - 1]
        })
      }
      self.emitSelectionEvent()
    },
    redraw: function () {
      let self = this
      self.$data.camera.position.x = self.$data.camPos.x + ((self.$data.offset.x * 0.005) * self.$data.lineMatrix.Y.scale)
      self.$data.camera.position.z = self.$data.camPos.z
      self.$data.camera.position.y = self.$data.camPos.y + ((self.$data.offset.y * 0.005) * self.$data.lineMatrix.Y.scale)
      self.$data.camera.lookAt(self.$data.camTarget.x, self.$data.camTarget.y, self.$data.camTarget.z)
      self.$data.renderer.render(self.$data.scene, self.$data.camera)
    },
    setup: function () {
      let self = this
      // console.log(document.querySelector('.view-container > canvas'))
      self.redraw()
      document.querySelector('.view-container > canvas').addEventListener('click', self.clickDetection)
      document.querySelector('.view-container > canvas').addEventListener('mousemove', self.hoverDetection)
    },
    setViewMode: function (dim) {
      let self = this
      self.$data.viewMode = dim
      // console.log(self.$data.camPos)
      let pos = dim === 3 ? {x: 0, y: 0, z: 0} : {x: -2.5, y: 2.5, z: 0}
      TweenLite.to(self.$data.camTarget, 0.5, {
        x: pos.x,
        y: pos.y,
        z: pos.z
      })
      let cam = dim === 3 ? {x: -3 * self.distfactor, y: 2 * self.distfactor, z: -5 * self.distfactor} : {x: -2.5, y: 2.5, z: -5 * self.distfactor}
      TweenLite.to(self.$data.camPos, 0.5, {
        x: cam.x,
        y: cam.y,
        z: cam.z,
        onUpdate: self.redraw
      })
      TweenLite.to(self.$data.lineMatrix.Y, 0.5, {
        scale: dim === 3 ? 1 : 0,
        onUpdate: function (_self) {
          for (let i = 0; i < _self.$data.lineMatrix.Y.listA.length; i++) {
            _self.$data.lineMatrix.Y.listA[i].scale.x = _self.$data.lineMatrix.Y.listA[i].name === 'axis' ? 0.06 : _self.$data.lineMatrix.Y.scale * 0.02
            _self.$data.lineMatrix.Y.listA[i].scale.z = _self.$data.lineMatrix.Y.listA[i].name === 'axis' ? 0.06 : _self.$data.lineMatrix.Y.scale * 0.02
            _self.$data.lineMatrix.Y.listB[i].scale.x = _self.$data.lineMatrix.Y.scale * 0.02
            _self.$data.lineMatrix.Y.listB[i].scale.y = _self.$data.lineMatrix.Y.scale * 0.02
            _self.$data.lineMatrix.Z.listA[i].scale.x = _self.$data.lineMatrix.Z.listA[i].name === 'axis' ? _self.$data.lineMatrix.Y.scale * 0.06 : _self.$data.lineMatrix.Y.scale * 0.02
            _self.$data.lineMatrix.Z.listA[i].scale.y = _self.$data.lineMatrix.Z.listA[i].name === 'axis' ? _self.$data.lineMatrix.Y.scale * 0.06 : _self.$data.lineMatrix.Y.scale * 0.02
            _self.$data.lineMatrix.Z.listB[i].scale.y = _self.$data.lineMatrix.Y.scale * 0.02
            _self.$data.lineMatrix.Z.listB[i].scale.z = _self.$data.lineMatrix.Y.scale * 0.02
            _self.$data.lineMatrix.ZLABEL.scale.set(2 * _self.$data.lineMatrix.Y.scale, 1 * _self.$data.lineMatrix.Y.scale, 1 * _self.$data.lineMatrix.Y.scale)
            _self.$data.lineMatrix.YLABEL.position.z = ((self.$data.maxVal * -1) * _self.$data.lineMatrix.Y.scale) - 1.2
            if (_self.$data.lineMatrix.Y.listA[i].name === 'axis') {
              _self.$data.lineMatrix.Y.listA[i].position.z = ((self.$data.maxVal * -1) * _self.$data.lineMatrix.Y.scale)
            }
            // _self.$data.lineMatrix.Y.listA[i].position.z = _self.$data.lineMatrix.Y.listA[i].name === 'axis' ? (self.$data.maxVal * -1) : _self.$data.lineMatrix.Y.scale * 0.02
          }
          for (let j = 0; j < _self.$data.lineMatrix.NUMBER_LABELS.length; j++) {
            if (_self.$data.lineMatrix.NUMBER_LABELS[j].name === 'y') {
              _self.$data.lineMatrix.NUMBER_LABELS[j].position.z = ((_self.$data.maxVal * -1) * _self.$data.lineMatrix.Y.scale)
            } else if (_self.$data.lineMatrix.NUMBER_LABELS[j].name === 'z') {
              _self.$data.lineMatrix.NUMBER_LABELS[j].scale.set(2 * _self.$data.lineMatrix.Y.scale, 1 * _self.$data.lineMatrix.Y.scale, 1 * _self.$data.lineMatrix.Y.scale)
            }
          }
        },
        onUpdateParams: [self]
      })
      self.shiftObjects()
    },
    processMouseEvent: function (e) {
      return {x: e.clientX, y: e.clientY}
    },
    clickDetection: function (e) {
      let self = this
      // console.log('clicked !!')
      let THREE = self.$data.THREE
      e.preventDefault()
      let coords = self.processMouseEvent(e)
      // console.log(self.$data.renderer.domElement.clientHeight)
      let raycaster = new THREE.Raycaster()
      let mouse = new THREE.Vector2()
      mouse.x = (coords.x / self.$data.renderer.domElement.clientWidth) * 2 - 1
      mouse.y = -(coords.y / self.$data.renderer.domElement.clientHeight) * 2 + 1
      // console.log(mouse.x)
      // console.log(mouse.y)
      raycaster.setFromCamera(mouse, self.$data.camera)
      // console.log(self.$data.points)
      let intersections = raycaster.intersectObjects(self.$data.points)
      // console.log(intersections)
      if (intersections.length > 0) {
        self.$data.didSelect = true
        // console.log(intersections[0].object.name)
        let objectIndex = Number(intersections[0].object.name.split('-')[1])
        self.$data.currentIndex = objectIndex
        self.positionCrossSectionBox()
        self.redraw()
        self.emitSelectionEvent()
      }
    },
    hoverDetection: function (e) {
      let self = this
      // console.log('clicked !!')
      let THREE = self.$data.THREE
      e.preventDefault()
      let coords = self.processMouseEvent(e)
      // console.log(self.$data.renderer.domElement.clientHeight)
      let raycaster = new THREE.Raycaster()
      let mouse = new THREE.Vector2()
      mouse.x = (coords.x / self.$data.renderer.domElement.clientWidth) * 2 - 1
      mouse.y = -(coords.y / self.$data.renderer.domElement.clientHeight) * 2 + 1
      // console.log(mouse.x)
      // console.log(mouse.y)
      raycaster.setFromCamera(mouse, self.$data.camera)
      // console.log(self.$data.points)
      let intersections = raycaster.intersectObjects(self.$data.points)
      // console.log(intersections)
      if (intersections.length > 0) {
        let objectIndex = Number(intersections[0].object.name.split('-')[1])
        self.$data.toolTipPosition.shown = true
        self.$data.toolTipPosition.x = coords.x + 20
        self.$data.toolTipPosition.y = coords.y
        self.$data.toolTipPosition.content = self.$data.allKeys[objectIndex]
        // console.log(objectIndex)
        // console.log(self.$data.valKeys)
      } else {
        self.$data.toolTipPosition.shown = false
        console.log(-1)
      }
    },
    positionCrossSectionBox: function () {
      let self = this
      let scaleFactor = self.$data.didSelect ? 1 : 0
      // console.log(scaleFactor)
      self.$data.crossSectionBox.scale.x = self.$data.points[self.$data.currentIndex].position.x * scaleFactor
      self.$data.crossSectionBox.scale.y = self.$data.points[self.$data.currentIndex].position.y * scaleFactor
      self.$data.crossSectionBox.scale.z = self.$data.points[self.$data.currentIndex].position.z * scaleFactor
      self.$data.crossSectionBox.position.x = (self.$data.points[self.$data.currentIndex].position.x / 2)
      self.$data.crossSectionBox.position.y = (self.$data.points[self.$data.currentIndex].position.y / 2)
      self.$data.crossSectionBox.position.z = (self.$data.points[self.$data.currentIndex].position.z / 2)
      self.$data.crossSectionBox.material.color.setHex(self.$data.points[self.$data.currentIndex].material.color.getHex())
    },
    emitSelectionEvent: function () {
      let self = this
      if (self.$data.currentIndex >= 0) {
        self.$emit('point-selection', {index: self.$data.currentIndex, metricIndexes: self.$data.metricIndexes})
      }
    },
    initualize: function () {
      let self = this
      self.$data.initalized = true
      var THREE = self.$data.THREE
      var containerElement = document.getElementById(self.$data.containerID)
      var _width = containerElement.getBoundingClientRect().width
      var _height = containerElement.getBoundingClientRect().height
      var renderer = new THREE.WebGLRenderer({ alpha: true })
      self.$data.renderer = renderer
      // self.$data.renderer = new self.$data.THREE.WebGLRenderer()
      renderer.setSize(_width, _height)
      containerElement.appendChild(renderer.domElement)
      var scene = new THREE.Scene()
      var camera = !self.isOrthographic > 0 ? new THREE.PerspectiveCamera(self.perspective, _width / _height, 1, 1000) : new THREE.OrthographicCamera(_width / (self.$data.axisData.scale * -2), _width / (self.$data.axisData.scale * 2), _height / (self.$data.axisData.scale * -2), _height / (self.$data.axisData.scale * 2), 1, 1000)
      var light0 = new THREE.AmbientLight(0x202020)
      scene.add(light0)
      var light1 = new THREE.PointLight(0xffffff, 0.5)
      light1.position.set(-12, 15, 10)
      scene.add(light1)
      var light2 = new THREE.DirectionalLight(0xffffff, 1)
      light2.position.set(0, 100, 10)
      scene.add(light2)
      var light1helper = new THREE.PointLightHelper(light1, 0.2)
      scene.add(light1helper)
      var light2helper = new THREE.DirectionalLightHelper(light2, 1)
      scene.add(light2helper)
      self.$data.scene = scene
      self.$data.camera = camera
      self.renderObjects()
      // var geometry = new THREE.PlaneGeometry(3, 3, 32)
      // var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xcc0000})
      // var plane = new THREE.Mesh(geometry, material)
      // plane.position.y = 0
      // plane.position.z = -20
      // plane.rotation.y = -45 * (Math.PI / 180)
      // plane.name = 'yo'
      // scene.add(plane)
      // material.map = new THREE.TextureLoader().load(texturePath)
      renderer.render(scene, camera)
      setTimeout(self.setup, 100)
      window.addEventListener('mousemove', function (e) {
        let mouse = self.processMouseEvent(e)
        let cMouse = {x: mouse.x - (window.innerWidth / 2), y: mouse.y - (window.innerHeight / 2)}
        self.$data.offset = cMouse
        // console.log(cMouse)
        self.redraw()
      })
    }
  },
  computed: {
    isOrthographic: function () {
      var self = this
      return self.perspective === 0
    },
    yFactor: function () {
      var self = this
      return self.isOrthographic ? -1 : 1
    }
  },
  mounted: function () {
    var self = this
    // console.log('hello hello')
    // console.log(self.$data.valMatrix)
    DataSlicer.loadData(function (d) {
      self.$data.laodedData = d
      let n = 0
      for (let k in d) {
        // console.log(DataSlicer.objectValues(DataSlicer.slice(['Fit with Brand 2013 Chrysler'], d[k]), []))
        if (n < 5) {
          self.$data.valKeys.push(k)
          n++
        }
        self.$data.allKeys.push(k)
      }
      // console.log(DataSlicer.slice(['Doors', 'Fit with Brand 2013 Dodge']))
    })
    // var THREE = require('three')
  }
}
</script>
<style lang="scss" scoped>

div.view-shell{
  position: fixed;
  top: 0;
  left: 0;
  bottom:250px;
  right:0;
  div.view-container{
    width:100%;
    height:100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
button, select{
  position:relative;
  z-index: 2000;
}
ul.filter-menu{
  position: fixed;
  top:0;
  left:0;
  bottom:250px;
  overflow-y: auto;
  display:block;
  width:300px;
  > li{
    display:block;
  }
  
}
ul.view-menu{
  position:fixed;
  right:5px;
  top:0;
  display:inline-block;
  > li{
    display: block;
  }
}
.scp3-tool-tip{
  position: absolute;
  z-index: 201;
  padding: 4px;
  background-color: #ffffff;
  box-shadow: 0 0 0 1px #333333;
}

</style>