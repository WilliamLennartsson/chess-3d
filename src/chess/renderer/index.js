import * as THREE from './dependencies/three/three.module.js'
import { prepModelsAndAnimations, loadOneGLTFModel } from './loaders.js'
import DragToRotateControls from './dragToRotateControls.js'
import ScrollToZoomControls from './scrollToZoomControls.js'

const ThreeDViewerProps = {
  containerId: '3dViewerContainer',
  models: null,
  canvasSize: {
    width: 0,
    height: 0
  }
}

const defaultModel = {
  url: './models/DuckModel/Duck.gltf',
  scale: { x: 3, y: 3, z: 3 },
  name: 'Fox',
}

const Renderer = (props) => {

  let currentModel = null
  let models = {}
  props = Object.assign(ThreeDViewerProps, props)
  let canvas = null
  let camera = null
  let scene = null
  let clock = null
  let renderer = null

  let scrollControls = null
  let rotateControls = null

  const init = (callback) => {
    const container = document.getElementById(props.containerId)

    const positionInfo = container.getBoundingClientRect()
    // Seems to work
    const canvasHeightStyle = parseInt(positionInfo.height)
    const canvasWidthStyle = parseInt(positionInfo.width)
    const canvasWidth = parseInt(canvasWidthStyle)
    const canvasHeight = parseInt(canvasHeightStyle)
    // Clock
    clock = new THREE.Clock()
    // Scene 
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x222222)
    // Camera
    const fov = 45
    const aspect = 2  // the canvas default
    const near = 0.1
    const far = 100
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(3, 5, 10)
    camera.rotation.x -= 0.8

    // Renderer
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvasWidth, canvasHeight)
    canvas = renderer.domElement
    container.appendChild(renderer.domElement)
    // Light
    var light = new THREE.DirectionalLight(0xfdfdfd, 2)
    light.position.set(2, 2, 1).normalize()
    scene.add(light)

    // Controls
    // Drag to rotate
    rotateControls = new DragToRotateControls(camera, () => {
      render()
    })
    // Scroll to zoom
    scrollControls = new ScrollToZoomControls(camera, canvas, () => {
      render()
    })
    loadAndDisplayDuckModel()
    if (callback) callback()
  }

  const drawBoard = (board) => {
    const tileWidth = 2
    const tileHeight = 0.2
    const spacing = 2
    board.forTile(tile => {
      drawTile(tile.x, tile.y, tileWidth, tileHeight, tile.id)
    })
    // board.tiles.map((cols, y) => {
    //   cols.map((tile, x) => {
    //   })
    // })
  }

  const drawTile = (x, y, w, h, id) => {
    const geometry = new THREE.BoxGeometry(w, h)
    const material = new THREE.MeshBasicMaterial({ color: id % 2 == 0 ? 0x00ff00 : 0xff00ff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.x = x
    cube.position.z = y
  }

  const loadAndDisplayDuckModel = () => {
    loadOneGLTFModel(defaultModel, (loadedModel) => {
      console.log('loadedModel :>> ', loadedModel);
      addModel(loadedModel)
    })
  }

  const addModel = function (model) {
    scene.add(model.gltf.scene)
    rotateControls.setModel(model.gltf.scene)
    render()
  }
  const resizeScreen = (renderer) => {
    if (!renderer) renderer = renderer // Handle empty input

    var positionInfo = canvas.parentElement.getBoundingClientRect()
    var canvasHeightStyle = positionInfo.height
    var canvasWidthStyle = positionInfo.width
    const canvasWidth = parseInt(canvasWidthStyle)
    const canvasHeight = parseInt(canvasHeightStyle)

    renderer.setSize(canvasWidth, canvasHeight)
    const canvas = renderer.domElement
    camera.aspect = canvas.clientWidth / canvas.clientHeight
    camera.updateProjectionMatrix()
    render()
  }
  const render = () => {
    renderer.render(scene, camera)
  }

  return {
    init,
    drawBoard
  }
}




export default Renderer