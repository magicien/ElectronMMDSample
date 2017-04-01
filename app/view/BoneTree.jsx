import React, {PropTypes} from 'react'
import styles from '../script/styles'
import * as filters from '../script/filter'
import {Treebeard} from 'react-treebeard'

export default class BoneTree extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      cursor: null,
      data: {}
    }

    this.onToggle = this.onToggle.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data})
  }

  onToggle(node, toggled) {
    if(this.state.cursor){
      this.state.cursor.active = false
    }
    node.active = true
    if(node.children){
      node.toggled = toggled
    }
    this.setState({cursor: node})
  }

  onFilterMouseUp(e) {
    const filter = e.target.value.trim()
    if(!filter){
      return this.setState({data: this.props.data})
    }
    let filtered = filters.filterTree(this.props.data, filter)
    filtered = filters.expandFilteredNodes(filtered, filter)
    this.setState({data: filtered})
  }

  render() {
    return (
      <div>
        <div style={styles.subcomponent}>
          <div className="input-group">
            <span className="input-group-addon">
              <i className="fa fa-search"></i>
            </span>
            <input type="text"
              className="form-control"
              placeholder="Search the tree..."
              onKeyUp={this.onFilterMouseUp.bind(this)}
            />
          </div>
        </div>
        <div style={styles.subcomponent}>
          <Treebeard
            data={this.state.data}
            onToggle={this.onToggle}
          />
        </div>
      </div>
    )
  }
}

BoneTree.defaultProps = {
  data: {}
}

BoneTree.propTypes = {
  data: PropTypes.object.isRequired
}

