

import { GLTFLoader } from '../../dependencies/GLTFLoader.js'
import loadingManager from './loadingManager.js'

const models = {
  fox: { url: './models/FoxModel/Fox.gltf', scale: { x: 0.2, y: 0.2, z: 0.2 } },
  duck: { url: './models/DuckModel/Duck.gltf', scale: { x: 8, y: 8, z: 8 } }
}

const gltfLoader = new GLTFLoader(loadingManager.manager)
// const dataPath = '../src/models/FoxModel/Fox.gltf'


export function prepModelsAnimations() {
  Object.values(models).forEach(model => {
    console.log('------->:', model.url)
    const animsByName = {}
    // TODO: Does it crash if model doenst have animation?
    model.gltf.animations.forEach((clip) => {
      animsByName[clip.name] = clip
      console.log('  ', clip.name)
    })
    model.animations = animsByName
  })
  return models
}

export function loadModels(init) {
  loadingManager.events(init)

  for (const model of Object.values(models)) {
    gltfLoader.load(model.url, (gltf) => {
      model.gltf = gltf
    })
  }
}

// export function loadFox() {
//     gltfLoader.load(dataPath, function (gltf) {
//         const gltfFox = gltf
//         const fox = gltf.scene.children[0]
//         fox.material = new THREE.MeshLambertMaterial()
//         fox.scale.set(4, 4, 4)
//         fox.position.z = 300

//         fox.rotation.y = 45
//         scene.add(gltf.scene)
//         console.log('gltf', gltf)
//         // Animation
//         mixer = new THREE.AnimationMixer(gltf.scene);
//         console.log("DOne loading model")
//     }, undefined, function (error) {
//         console.error(error)
//     })
// }

