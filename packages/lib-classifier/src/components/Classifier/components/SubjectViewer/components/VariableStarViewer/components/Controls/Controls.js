import React from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  CheckBox,
  FormField,
  RadioButtonGroup,
  ThemeContext
} from 'grommet'
import styled, { css } from 'styled-components'
import { PlainButton, SpacedText, withThemeContext } from '@zooniverse/react-components'
import counterpart from 'counterpart'
import FlipIcon from '../FlipIcon'
import en from '../../locales/en'
import theme from './theme'
import getDataSeriesColor from '../../../../helpers/getDataSeriesColor'
import getDataSeriesSymbol from '../../../../helpers/getDataSeriesSymbol'
import getCheckBoxTheme from './getCheckBoxTheme'

counterpart.registerTranslations('en', en)

export const StyledPlainButton = styled(PlainButton)`
  > div {
    flex-direction: column;
  }
`

function Label ({ label, ...rest }) {
  return (
    <SpacedText
      size='0.5em'
      weight='bold'
      {...rest}
    >
      {label}
    </SpacedText>
  )
}

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
        label={<Label label={counterpart('VariableStarViewer.flip')} />}
        onClick={event => setYAxisInversion(event)}
        pad='small'
      />
      <FormField
        htmlFor='periodMultiple'
        label={<SpacedText size='10px' weight='bold'>{counterpart('VariableStarViewer.periodMultiple')}</SpacedText>}
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
        <Box 
          direction='row'

          pad='none'
        >
          {focusedSeries.map((series, seriesIndex) => {
            const [[label, checked]] = Object.entries(series)
            const { seriesOptions } = data[seriesIndex]
            const color = getDataSeriesColor(seriesOptions, seriesIndex, focusedSeries, colors)
            const Glyph = getDataSeriesSymbol(seriesIndex)
            const checkBoxTheme = getCheckBoxTheme(color)
            return (
              <Box border={{ color: 'light-6', size: 'xsmall' }} pad={{ horizontal: '5px', vertical: '2.5px' }} round='xsmall'>
                <ThemeContext.Extend
                  key={`${label}-${seriesIndex}`}
                  value={checkBoxTheme}
                >
                  <CheckBox
                    checked={checked}
                    id={label}
                    label={
                      <Box direction='row'>
                        <SpacedText style={{ fontSize: '0.5em', whiteSpace: 'nowrap' }}>
                          {label}
                        </SpacedText>
                        <svg height='10px' viewBox='0 0 10 10' width='10px' style={{ padding: '1.5px 0 0 1ch' }}>
                          <Glyph left={5} fill={color} size={20} top={5} />
                        </svg>
                      </Box>
                    }
                    name='series-focus'
                    onChange={event => { setSeriesFocus(event) }}
                    type='checkbox'
                    value={label}
                  />
                </ThemeContext.Extend>
              </Box>
            )
          })}
        </Box>
        <Label label={counterpart('VariableStarViewer.focus')} margin={{ top: 'xsmall' }} />
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