import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import styles from '../script/styles'
import {
  SCNCanvas,
  SCNView,
  SCNScene,
  SCNNode,
  SCNCamera,
  SCNLight,
  SCNVector3,
  SCNVector4,
  SKColor,
  SCNBox,
  SCNMaterial,
  CABasicAnimation
} from 'jscenekit'
import {
  BinaryReader,
  MMDIKController,
  MMDSceneSource
} from 'jmmdscenekit'

export default class SCNViewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: new SCNView(),
      pipe: Promise.resolve(),
      modelObj: null,
      motionObj: null
    }
  }

  componentDidMount() {
    this.state.view.appendTo(ReactDOM.findDOMNode(this))
    this._setupView()

    if(this.props.model !== null){
      this._updateModel(this.props.model)
    }
    if(this.props.motion !== null){
      this._updateMotion(this.props.motion)
    }
    if(this.props.model !== null && this.props.motion !== null){
      this._setMotion()
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps:' + nextProps)
    if(this.props.model !== nextProps.model){
      console.log(`model: ${nextProps.model}`)
      this._updateModel(nextProps.model)
    }
    if(this.props.motion !== nextProps.motion){
      this._updateMotion(nextProps.motion)
    }
    if(this.props.model !== nextProps.model || this.props.motion !== nextProps.motion){
      if(this.props.motion !== null){
        this._setMotion()
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // do something if needed
    return false
  }

  _setupView() {
    const view = this.state.view

    // create a new scene
    const scene = new SCNScene()

    // set the scene to the view
    view.scene = scene

    // allows the user to the manipulate the camera
    view.allowsCameraControl = true

    // show statistics such as fps and timing information
    view.showsStatistics = true

    // configure the view
    view.backgroundColor = SKColor.black

    view.delegate = MMDIKController.sharedController


    // create and add a camera to the scene
    const cameraNode = new SCNNode()
    cameraNode.camera = new SCNCamera()
    scene.rootNode.addChildNode(cameraNode)

    view.pointOfView = cameraNode

    // place the camera
    cameraNode.position = new SCNVector3(0, 15, 15)
    //cameraNode.position = new SCNVector3(0, 18, 4)
    //cameraNode.position = new SCNVector3(0, 3, 2)
    cameraNode.rotation = new SCNVector4(1, 0, 0, -Math.PI * 0.10)
    cameraNode.camera.zNear = 1.0
    cameraNode.camera.zFar = 20.0

    // create and add a light to the scene
    const lightNode = new SCNNode()
    lightNode.light = new SCNLight()
    lightNode.light.type = SCNLight.LightType.directional
    lightNode.light.color = SKColor.lightGray
    lightNode.position = new SCNVector3(0, 10, 10)
    scene.rootNode.addChildNode(lightNode)

    // create and add an ambient light to the scene
    const ambientLightNode = new SCNNode()
    ambientLightNode.light = new SCNLight()
    ambientLightNode.light.type = SCNLight.LightType.ambient
    ambientLightNode.light.color = SKColor.darkGray
    scene.rootNode.addChildNode(ambientLightNode)

    view.play()
  }

  _updateModel(modelPath) {
    this.state.pipe = this.state.pipe.then(() => {
      const promise = MMDSceneSource.sceneSourceWithPathOptions(modelPath)
        .then((source) => {
          const scene = this.state.view.scene
          const model = source.getModel()
          if(model){
            if(this.state.modelObj){
              this.state.modelObj.removeFromParentNode()
            }
            scene.rootNode.addChildNode(model)
            this.state.modelObj = model
            if(this.props.onModelChanged){
              this.props.onModelChanged(this.state.modelObj)
            }
          }
        })
        .catch((error) => {
          if(this.props.onError){
            this.props.onError(error)
          }
        })
      return promise
    })
  }

  _updateMotion(motionPath) {
    this.state.pipe = this.state.pipe.then(() => {
      const promise = MMDSceneSource.sceneSourceWithPathOptions(motionPath)
        .then((source) => {
          const motion = source.getMotion()
          if(motion){
            motion.repeatCount = Infinity
            this.state.motionObj = motion
            if(this.props.onMotionChanged){
              this.props.onMotionChanged(this.state.motionObj)
            }
          }
        })
        .catch((error) => {
          if(this.props.onError){
            this.props.onError(error)
          }
        })
      return promise
    })
  }

  _setMotion() {
    this.state.pipe = this.state.pipe.then(() => {
      this.state.modelObj.addAnimationForKey(this.state.motionObj, 'motion')
    })
  }

  render() {
    return (
      <div style={styles.subcomponent}></div>
    )
  }
}

SCNViewer.defaultProps = {
  model: null,
  motion: null,
  onModelChanged: null,
  onMotionChanged: null,
  onError: null
}

SCNViewer.propTypes = {
  model: PropTypes.string,
  motion: PropTypes.string,
  onModelChanged: PropTypes.func,
  onMotionChanged: PropTypes.func,
  onError: PropTypes.func
}

