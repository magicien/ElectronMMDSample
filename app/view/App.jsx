import React from 'react'
import styles from '../script/styles'
import {StyleRoot} from 'radium'
import {SCNView} from 'jscenekit'
import SCNViewer from './SCNViewer.jsx'
import BoneTree from './BoneTree.jsx'
import {remote} from 'electron'

const Dialog = remote.dialog

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      boneData: {},
      model: `${__dirname}/../resource/miku.pmd`,
      motion: `${__dirname}/../resource/running.vmd`
    }
  }

  _modelChanged(modelObj) {
    console.log(`modelObj: ${modelObj}`)
    const boneData = this._createBoneData(modelObj)
    this.setState({boneData: boneData})
  }

  _createBoneData(modelObj) {
    const data = {
      name: modelObj.name,
      toggled: false,
      children: []
    }
    modelObj.childNodes.forEach((child) => {
      const childData = this._createBoneData(child)
      data.children.push(childData)
    })
    return data
  }

  _modelButtonClicked() {
    Dialog.showOpenDialog(null, {
      properties: ['openFile'],
      title: 'モデルファイルを選択してください',
      filters: [
        {name: 'モデルファイル', extensions: ['pmd', 'pmx', 'x', 'vac', 'obj', 'dae', 'abc', 'scn']}
      ]
    }, (fileNames) => {
      if(fileNames && fileNames.length === 1){
        const fileName = fileNames[0]
        this.setState({model: fileName})
      }
    })
  }

  _motionButtonClicked() {
    Dialog.showOpenDialog(null, {
      properties: ['openFile'],
      title: 'モーションファイルを選択してください',
      filters: [
        {name: 'モーションファイル', extensions: ['vmd', 'vpd', 'dae', 'scn']}
      ]
    }, (fileNames) => {
      if(fileNames && fileNames.length === 1){
        const fileName = fileNames[0]
        this.setState({motion: fileName})
      }
    })

  }

  _showError(error) {
    Dialog.showErrorBox('Error', `${error}`)
  }

  render() {
    const modelFile = this.state.model === null ? 'No Model' : this.state.model.split('/').pop()
    const motionFile = this.state.motion === null ? 'No Motion' : this.state.motion.split('/').pop()

    return (
      <StyleRoot>
        <div style={styles.component}>
          <BoneTree data={this.state.boneData} />
        </div>
        <div style={styles.component}>
          <SCNViewer 
            model={this.state.model} 
            motion={this.state.motion} 
            onModelChanged={(modelObj) => this._modelChanged(modelObj)}
            onError={(error) => this._showError(error)}
          />
          <div className="form-group">
            <label>Model:</label>
            <div className="input-group">
              <span className="input-group-btn">
                <button className="btn btn-default" onClick={() => this._modelButtonClicked()}>
                  Change
                </button>
              </span>
              <input type="text" className="form-control" value={modelFile} readOnly="readOnly" />
            </div>
          </div>
          <div className="form-group">
            <label>Motion:</label>
            <div className="input-group">
              <span className="input-group-btn">
                <button className="btn btn-default" onClick={() => this._motionButtonClicked()}>
                  Change
                </button>
              </span>
              <input type="text" className="form-control" value={motionFile} readOnly="readOnly" />
            </div>
          </div>
        </div>
      </StyleRoot>
    )
  }
}
