import { css } from 'styled-components'
import React from 'react'
import { Blank } from 'grommet-icons'

function Circle (props) {
  return (
    <svg viewBox='0 0 12 12' {...props}>
      <g transform='translate(12px, 12px)'>
        <circle rx={12} ry={12} r={4} />
      </g>
    </svg>
  )
}

const theme = {
  checkBox: {
    gap: 'xsmall',
    // icons: {
    //   checked: Circle
    // },
    size: '12px'
  },
  formField: {
    border: 'none',
    extend: () => css`
      flex-direction: column-reverse;
    `,
    label: {
      margin: 'none'
    },
    margin: 'none'
  },
  radioButton: {
    gap: 'xsmall',
    size: '12px',
    icon: {
      size: '6px'
    }
  }
}

export default theme