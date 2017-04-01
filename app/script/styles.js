'use strict'

export default {
  component: {
    width: '50%',
    display: 'inline-block',
    verticalAlign: 'top',
    padding: '20px',
    '@media (maxWidth: 640px)': {
      width: '100%',
      display: 'block'
    }
  },
  subcomponent: {
    padding: '0 0 20px 0'
  },
  viewer: {
    padding: '20px'
  }
}
