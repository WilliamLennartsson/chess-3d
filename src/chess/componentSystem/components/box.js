
import * as THREE from '../../../dependencies/three.module.js'
import Component from './component.js';

export default class Box extends Component {
  constructor(gameObject, { x, y, z } = { x: 0, y: 0, z: 0 }, w, h, d) {
    super(gameObject)
    this.gameObject = gameObject
    const geometry = new THREE.BoxGeometry(w, h, d)
    const id = 1
    const material = new THREE.MeshBasicMaterial({ color: id % 2 == 0 ? 0x00ff00 : 0xff00ff });
    const cube = new THREE.Mesh(geometry, material);
    gameObject.transform.add(cube);
    cube.position.x = x
    cube.position.y = y
    cube.position.z = z
  }
  update(deltaTime) {
  }
}