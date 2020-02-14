import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  CheckBox,
  FormField,
  RadioButtonGroup
} from 'grommet'
import styled, { css } from 'styled-components'
import { PlainButton, SpacedText, withThemeContext } from '@zooniverse/react-components'
import counterpart from 'counterpart'
import FlipIcon from '../FlipIcon'
import en from '../../locales/en'
import theme from './theme'
import getDataSeriesColor from '../../../../helpers/getDataSeriesColor'

counterpart.registerTranslations('en', en)

const StyledPlainButton = styled(PlainButton)`
  > div {
    flex-direction: column;
  }
`

const StyledCheckBox = styled(CheckBox)`

  /* > svg { */
    ${props => css`
      border-color: ${props.color};
      color: ${props.color};
      fill: ${props.color};
      stroke: ${props.color};
    `}
  /* } */
`

function Controls(props) {
  const {
    data,
    focusedSeries,
    gridArea,
    periodMultiple,
    setSeriesFocus,
    setPeriodMultiple,
    setYAxisInversion,
    theme: {
      global: {
        colors
      }
    }
  } = props
  return (
    <Box
      background='neutral-6'
      direction='row'
      gap='xsmall'
      gridArea={gridArea}
      pad='xsmall'
    >
      <SpacedText
        style={{ fontSize: '0.5em', transform: 'rotate(180deg)', writingMode: 'vertical-lr' }}
      >
        {counterpart('VariableStarViewer.controls')}
      </SpacedText>
      <StyledPlainButton
        icon={<FlipIcon />}
        label={<SpacedText size='xsmall'>{counterpart('VariableStarViewer.flip')}</SpacedText>}
        onClick={event => setYAxisInversion(event)}
        pad='small'
      />
      <FormField
        htmlFor='periodMultiple'
        label={<SpacedText size='xsmall'>{counterpart('VariableStarViewer.periodMultiple')}</SpacedText>}
      >
        <RadioButtonGroup
          direction='row'
          gap='xsmall'
          id='periodMultiple'
          name='periodMultiple'
          onChange={event => setPeriodMultiple(event)}
          options={['0.5', '1', '2', '3']}
          value={periodMultiple.toString()}
        />
      </FormField>
      <Box>
        <fieldset style={{ border: 'none', padding: 0 }}>
          {focusedSeries.map((series, seriesIndex) => {
            const [[label, checked]] = Object.entries(series)
            const { seriesOptions } = data[seriesIndex]
            const color = getDataSeriesColor(seriesOptions, seriesIndex, focusedSeries, colors)
            return (
              <StyledCheckBox
                checked={checked}
                color={color}
                id={label}
                key={`${label}-${seriesIndex}`}
                label={<SpacedText style={{ fontSize: '0.5em' }}>{label}</SpacedText>}
                name='series-focus'
                onChange={event => { setSeriesFocus(event) }}
                type='checkbox'
                value={label}
              />
            )
          })}
        </fieldset>
        <SpacedText size='xsmall'>
          {counterpart('VariableStarViewer.focus')}
        </SpacedText>
      </Box>
    </Box>
  )
}

Controls.defaultProps = {
  data: [],
  focusedSeries: [],
  gridArea: '',
  periodMultiple: 1,
  setPeriodMultiple: () => {},
  setYAxisInversion: () => {},
  theme: {
    global: {
      colors: {}
    }
  }
}

Controls.propTypes = {
  data: PropTypes.array,
  focusedSeries: PropTypes.array,
  gridArea: PropTypes.string,
  periodMultiple: PropTypes.number,
  setSeriesFocus: PropTypes.func,
  setPeriodMultiple: PropTypes.func,
  setYAxisInversion: PropTypes.func,
  theme: PropTypes.object
}

export default withThemeContext(Controls, theme)