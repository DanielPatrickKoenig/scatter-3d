<template>
  <div class="view-shell">
    <div class="view-container" :id="containerID">
    </div>
    <wireframe :objects="objects" :axis="axis" :scale="axisData.scale"></wireframe>
  </div>
</template>
<script>
import {ObjectTypes} from './ObjectTypes.js'
import {AxisTypes} from './AxisTypes.js'
import SingleAxisWireFrame from './SingleAxisWireFrame.vue'
export default {
  props: ['objects', 'perspective', 'axis', 'signature'],
  components: {
    wireframe: SingleAxisWireFrame
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
      meshes: []
    }
  },
  watch: {
    signature: function () {
      var self = this
      // console.log('sig change')
      self.$data.sig = self.signature
      self.updateObjects()
      self.$data.renderer.render(self.$data.scene, self.$data.camera)
    }
  },
  methods: {
    renderObjects: function () {
      var self = this
      var THREE = self.$data.THREE
      // var renderer = self.$data.renderer
      // var camera = self.$data.camera
      var scene = self.$data.scene
      for (var i = 0; i < self.objects.length; i++) {
        var obj = {}
        var geometry = {}
        var material = {}
        var wireframe = {}
        var line = {}
        var mesh = {}
        var phongMat = new THREE.MeshPhongMaterial({color: 0x0000cc, specular: 0xffffff})
        switch (self.objects[i].type.id) {
          case ObjectTypes.PLANE.id: {
            geometry = new THREE.PlaneBufferGeometry(1, 1, 32)
            material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xcc0000, transparent: true})
            if (self.isOrthographic) {
              wireframe = new THREE.EdgesGeometry(geometry)
              line = new THREE.LineSegments(wireframe, material)
              line.material.depthTest = false
              line.material.opacity = 1
              line.material.transparent = true
              scene.add(line)
              obj = line
            } else {
              mesh = new THREE.Mesh(geometry, phongMat)
              scene.add(mesh)
              obj = mesh
            }
            break
          }
          case ObjectTypes.BOX.id: {
            geometry = new THREE.BoxBufferGeometry(1, 1, 1, 32, 32, 32)
            material = new THREE.MeshBasicMaterial({color: 0xcc0000})
            if (self.isOrthographic) {
              wireframe = new THREE.EdgesGeometry(geometry)
              line = new THREE.LineSegments(wireframe, material)
              line.material.depthTest = false
              line.material.opacity = 1
              line.material.transparent = true
              scene.add(line)
              obj = line
            } else {
              mesh = new THREE.Mesh(geometry, phongMat)
              scene.add(mesh)
              obj = mesh
            }
            break
          }
          case ObjectTypes.SPHERE.id: {
            geometry = new THREE.SphereBufferGeometry(1)
            material = new THREE.MeshBasicMaterial({color: 0xcc0000})
            if (self.isOrthographic) {
              wireframe = new THREE.EdgesGeometry(geometry)
              line = new THREE.LineSegments(wireframe, material)
              line.material.depthTest = false
              line.material.opacity = 1
              line.material.transparent = true
              scene.add(line)
              obj = line
            } else {
              mesh = new THREE.Mesh(geometry, phongMat)
              scene.add(mesh)
              obj = mesh
            }
            break
          }
          case ObjectTypes.CONE.id: {
            geometry = new THREE.ConeBufferGeometry(0.5, 1, 32)
            material = new THREE.MeshBasicMaterial({color: 0xcc0000})
            if (self.isOrthographic) {
              wireframe = new THREE.EdgesGeometry(geometry)
              line = new THREE.LineSegments(wireframe, material)
              line.material.depthTest = false
              line.material.opacity = 1
              line.material.transparent = true
              scene.add(line)
              obj = line
            } else {
              mesh = new THREE.Mesh(geometry, phongMat)
              scene.add(mesh)
              obj = mesh
            }
            break
          }
          case ObjectTypes.CYLINDER.id: {
            geometry = new THREE.CylinderBufferGeometry(1 - self.objects[i].ratio, self.objects[i].ratio, 1, 32)
            material = new THREE.MeshBasicMaterial({color: 0xcc0000})
            if (self.isOrthographic) {
              wireframe = new THREE.EdgesGeometry(geometry)
              line = new THREE.LineSegments(wireframe, material)
              line.material.depthTest = false
              line.material.opacity = 1
              line.material.transparent = true
              scene.add(line)
              obj = line
            } else {
              mesh = new THREE.Mesh(geometry, phongMat)
              scene.add(mesh)
              obj = mesh
            }
            break
          }
          case ObjectTypes.TORUS.id: {
            geometry = new THREE.TorusBufferGeometry(1, self.objects[i].ratio, 16, 100)
            material = new THREE.MeshBasicMaterial({color: 0xcc0000})
            if (self.isOrthographic) {
              wireframe = new THREE.EdgesGeometry(geometry)
              line = new THREE.LineSegments(wireframe, material)
              line.material.depthTest = false
              line.material.opacity = 1
              line.material.transparent = true
              scene.add(line)
              obj = line
            } else {
              mesh = new THREE.Mesh(geometry, phongMat)
              scene.add(mesh)
              obj = mesh
            }
            break
          }
          case ObjectTypes.TUBE.id: {
            var points = []
            for (var j = 0; j < self.objects[i].points.length; j++) {
              points.push(new THREE.Vector3(self.objects[i].points[j].x, self.objects[i].points[j].y, self.objects[i].points[j].z))
            }
            geometry = new THREE.TubeGeometry(new THREE.SplineCurve3(points), 64, 1, 8, false)
            material = new THREE.MeshBasicMaterial({color: 0xcc0000})
            if (self.isOrthographic) {
              wireframe = new THREE.EdgesGeometry(geometry)
              line = new THREE.LineSegments(wireframe, material)
              line.material.depthTest = false
              line.material.opacity = 1
              line.material.transparent = true
              scene.add(line)
              obj = line
            } else {
              mesh = new THREE.Mesh(geometry, phongMat)
              scene.add(mesh)
              obj = mesh
            }
            break
          }
          case ObjectTypes.LATHE.id: {
            var lpoints = []
            for (var k = 0; k < self.objects[i].points.length; k++) {
              lpoints.push(new THREE.Vector3(self.objects[i].points[k].x, self.objects[i].points[k].y))
            }
            geometry = new THREE.LatheGeometry(lpoints, 64, 1, 8, false)
            material = new THREE.MeshBasicMaterial({color: 0xcc0000})
            if (self.isOrthographic) {
              wireframe = new THREE.EdgesGeometry(geometry)
              line = new THREE.LineSegments(wireframe, material)
              line.material.depthTest = false
              line.material.opacity = 1
              line.material.transparent = true
              scene.add(line)
              obj = line
            } else {
              mesh = new THREE.Mesh(geometry, phongMat)
              scene.add(mesh)
              obj = mesh
            }
            break
          }
        }
        if (obj !== {}) {
          self.$data.meshes.push(obj)
          obj.position.x = self.objects[i].position.x
          obj.position.y = self.objects[i].position.y * self.yFactor
          obj.position.z = self.objects[i].position.z
          obj.rotation.x = self.objects[i].rotation.x * (Math.PI / 180)
          obj.rotation.y = self.objects[i].rotation.y * (Math.PI / 180)
          obj.rotation.z = self.objects[i].rotation.z * (Math.PI / 180)
          obj.scale.x = self.objects[i].scale.x
          obj.scale.y = self.objects[i].scale.y * self.yFactor
          obj.scale.z = self.objects[i].scale.z
          obj.name = 'yo'
        }
      }
    },
    updateObjects: function () {
      var self = this
      for (var i = 0; i < self.objects.length; i++) {
        self.$data.meshes[i].position.x = self.objects[i].position.x
        self.$data.meshes[i].position.y = self.objects[i].position.y * self.yFactor
        self.$data.meshes[i].position.z = self.objects[i].position.z
        self.$data.meshes[i].rotation.x = self.objects[i].rotation.x * (Math.PI / 180)
        self.$data.meshes[i].rotation.y = self.objects[i].rotation.y * (Math.PI / 180)
        self.$data.meshes[i].rotation.z = self.objects[i].rotation.z * (Math.PI / 180)
        self.$data.meshes[i].scale.x = self.objects[i].scale.x
        self.$data.meshes[i].scale.y = self.objects[i].scale.y * self.yFactor
        self.$data.meshes[i].scale.z = self.objects[i].scale.z
        // if (self.objects[i].ratio !== undefined) {
        //   console.log(self.$data.meshes[i])
        // }
        // obj.name = 'yo'
      }
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
    // var THREE = require('three')
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
    if (self.isOrthographic) {
      switch (self.$data.axisData.axis) {
        case AxisTypes.X: {
          // console.log('x view')
          camera.rotation.y = -90 * (Math.PI / 180)
          camera.position.x = -10
          break
        }
        case AxisTypes.Y: {
          // console.log('y view')
          camera.rotation.x = 90 * (Math.PI / 180)
          camera.position.y = -10
          break
        }
        case AxisTypes.Z: {
          // console.log('z view')
          // camera.rotation.z = 90 * (Math.PI / 180)
          camera.position.z = -10
          break
        }
      }
    } else {
      var light0 = new THREE.AmbientLight(0x202020)
      scene.add(light0)
      var light1 = new THREE.PointLight(0xffffff, 0.5)
      light1.position.set(-12, 15, 10)
      scene.add(light1)
      var light2 = new THREE.DirectionalLight(0xffffff, 0.3)
      light2.position.set(0, 100, 10)
      scene.add(light2)
      var light1helper = new THREE.PointLightHelper(light1, 0.2)
      scene.add(light1helper)
      var light2helper = new THREE.DirectionalLightHelper(light2, 1)
      scene.add(light2helper)
    }
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
  }
}
</script>
<style lang="scss" scoped>

div.view-shell{
  width:100%;
  height:100%;
  position: absolute;
  top: 0;
  left: 0;
  div.view-container{
    width:100%;
    height:100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
