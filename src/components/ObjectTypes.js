export const ObjectTypes = {
  PLANE: {id: 0, label: 'Plane', template: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}}},
  BOX: {id: 2, label: 'Cube', template: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}}},
  SPHERE: {id: 3, label: 'Sphere', template: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}}},
  CONE: {id: 4, label: 'Cone', template: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}}},
  CYLINDER: {id: 5, label: 'Cylinder', template: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}, ratio: 0.5}},
  TORUS: {id: 6, label: 'Torus', template: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}, ratio: 0.5}},
  TUBE: {id: 7, label: 'Tube', template: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}, points: [{x: 0, y: -1, z: 0}, {x: 0, y: 1, z: 0}]}},
  LATHE: {id: 8, label: 'Lathe', template: {position: {x: 0, y: 0, z: 0}, rotation: {x: 0, y: 0, z: 0}, scale: {x: 1, y: 1, z: 1}, points: [{x: 0, y: -1}, {x: 1, y: 1}]}}
}
