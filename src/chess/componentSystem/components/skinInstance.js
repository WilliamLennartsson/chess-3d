import * as THREE from '../../../dependencies/three.module.js'
import Component from './component.js'
import { SkeletonUtils } from '../../../dependencies/SkeletonUtils.js'

export default class SkinInstance extends Component {
  constructor(gameObject, model) {
    super(gameObject)
    this.model = model
    this.animRoot = SkeletonUtils.clone(this.model.gltf.scene)
    this.mixer = new THREE.AnimationMixer(this.animRoot)
    gameObject.transform.add(this.animRoot)
    this.actions = {}
  }
  setAnimation(animName) {
    let clip
    if (!animName) clip = this.model.animations[Object.keys(this.model.animations)[0]]
    else clip = this.model.animations[animName]
    // turn off all current actions
    for (const action of Object.values(this.actions)) {
      action.enabled = false
    }
    // get or create existing action for clip
    const action = this.mixer.clipAction(clip)
    action.enabled = true
    action.reset()
    action.play()
    this.actions[animName] = action
  }
  update(deltaTime) {
      this.mixer.update(deltaTime)
  }
}