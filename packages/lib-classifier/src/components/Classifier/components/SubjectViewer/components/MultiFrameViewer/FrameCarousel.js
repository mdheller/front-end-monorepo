import counterpart from 'counterpart'
import { Button, Box } from 'grommet'
import { FormUp, FormDown } from 'grommet-icons'
import { tint } from 'polished'
import PropTypes from 'prop-types'
import React from 'react'
import styled, { css, withTheme } from 'styled-components'

import locationValidator from '../../helpers/locationValidator'
import en from './locales/en'

counterpart.registerTranslations('en', en)

export const StyledControlButton = styled(Button)`
  ${props => props.theme && css`
    color: ${props.theme.global.colors['neutral-6']};
    background: ${props.theme.global.colors.brand};

    &:hover, &:focus, not(:disabled) {
      background: ${tint(0.5, props.theme.global.colors.brand)};
      box-shadow: none;
    }
  `}
`

export function PreviousLabel () {
  return (
    <Box
      as='span'
      align='center'
      direction='column'
    >
      <FormUp color='neutral-6' />
      {counterpart('MultiFrameViewer.FrameCarousel.previousFrameLabel')}
    </Box>
  )
}

export function NextLabel () {
  return (
    <Box
      as='span'
      align='center'
      direction='column'
    >
      {counterpart('MultiFrameViewer.FrameCarousel.nextFrameLabel')}
      <FormDown color='neutral-6' />
    </Box>
  )
}

export const StyledInput = styled.input`
  ${props => props.theme && css`
    &:checked + img {
      outline: ${props.theme.global.colors['neutral-4']} solid;
    }
  `}
  clip: rect(0 0 0 0);
  overflow: hidden;
  position: absolute;
`

export const StyledImage = styled.img`
  height: 40px;
  object-fit: cover;
  padding: 0;
  width: 40px;
`

class FrameCarousel extends React.Component {
  constructor () {
    super()
    this.handleScroll = this.handleScroll.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.activeLabel = React.createRef()
    this.frameList = React.createRef()
  }

  componentDidMount () {
    this.handleScroll()
  }

  handleScroll () {
    // console.log('active label rect', this.activeLabel.current.getBoundingClientRect())
    // console.log('frame list rect', this.frameList.current.getBoundingClientRect())
    console.log('active label offset', this.activeLabel.current.offsetTop)
    console.log('frame list scroll top', this.frameList.current.scrollTop)
    console.log('frame list offset top', this.frameList.current.offsetTop)
    console.log('subtraction', this.frameList.current.scrollTop - this.frameList.current.offsetTop)

    const labelIsAboveContainerTop = this.activeLabel.current.offsetTop <= this.frameList.current.scrollTop
    const labelIsBelowContainerBottom = this.activeLabel.current.offsetTop >= (this.frameList.current.scrollTop + this.frameList.current.clientHeight)
    console.log('labelIsAboveContainerTop', labelIsAboveContainerTop)
    console.log('labelIsBelowContainerBottom', labelIsBelowContainerBottom)
    if (labelIsAboveContainerTop || labelIsBelowContainerBottom) {
      const newContainerTopPosition = this.activeLabel.current.offsetTop - this.activeLabel.current.offsetHeight
      console.log('newContainerTopPosition', newContainerTopPosition)
      this.frameList.current.scrollTop = newContainerTopPosition
      // this.activeLabel.current.scrollIntoView({ block: 'nearest', inline: 'start' })
    }
  }

  handleFrameChange (frameIndex) {
    const { onFrameChange } = this.props
    onFrameChange(frameIndex, this.handleScroll())
  }

  handlePrevious () {
    const { frame } = this.props
    if (frame > 0) {
      this.handleFrameChange(frame - 1)
    }
  }

  handleNext () {
    const { frame, locations } = this.props
    if (frame < locations.length) {
      this.handleFrameChange(frame + 1)
    }
  }

  render () {
    const { frame, locations } = this.props
    const locationElements = locations.map((location, index) => {
      const mimeType = Object.keys(location)[0]
      const url = location[mimeType]
      const activeFrame = frame === index
      return (
        <label
          key={`${url}-${index}`}
          ref={activeFrame ? this.activeLabel : null}
          style={{ position: 'relative', height: '40px', width: '40px' }}
        >
          <StyledInput
            checked={activeFrame}
            name='frame'
            onChange={() => this.handleFrameChange(index)}
            src={url}
            type='radio'
          />
          <StyledImage src={url} alt={counterpart('MultiFrameViewer.FrameCarousel.thumbnailAltText')} />
        </label>
      )
    })

    return (
      <Box
        background={{ dark: 'dark-3', light: 'neutral-6' }}
        direction='column'
        height='450px'
        width='7em'
      >
        <StyledControlButton
          disabled={frame === 0}
          fill='horizontal'
          label={<PreviousLabel />}
          onClick={() => this.handlePrevious()}
        />
        <Box
          align='center'
          as='ul'
          direction='column'
          fill
          overflow='auto'
          ref={this.frameList}
          style={{ position: 'relative', scrollBehavior: 'smooth' }}
        >
          {locationElements}
        </Box>
        <StyledControlButton
          align='center'
          disabled={frame === (locations.length - 1)}
          fill='horizontal'
          label={<NextLabel />}
          onClick={() => this.handleNext()}
        />
      </Box>
    )
  }
}

FrameCarousel.propTypes = {
  frame: PropTypes.number.isRequired,
  locations: PropTypes.arrayOf(locationValidator).isRequired,
  onFrameChange: PropTypes.func.isRequired,
  theme: PropTypes.object
}

FrameCarousel.defaultProps = {
  theme: {
    global: {
      colors: {}
    }
  }
}

export default withTheme(FrameCarousel)
export { FrameCarousel }
