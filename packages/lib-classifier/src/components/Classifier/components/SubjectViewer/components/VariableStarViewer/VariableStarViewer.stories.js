import React from 'react'
import { storiesOf } from '@storybook/react'
import { Provider } from 'mobx-react'
import zooTheme from '@zooniverse/grommet-theme'
import { Box, Grommet } from 'grommet'
import { withKnobs, boolean, text, object } from '@storybook/addon-knobs'
import VariableStarViewer from './VariableStarViewer'
import VariableStarViewerContainer from './VariableStarViewerContainer'
import ZoomInButton from '../../../ImageToolbar/components/ZoomInButton/ZoomInButton'
import ZoomOutButton from '../../../ImageToolbar/components/ZoomOutButton/ZoomOutButton'
import ResetButton from '../../../ImageToolbar/components/ResetButton/ResetButton'
import {
  variableStarAmplitudeMockData,
  variableStarPeriodMockData
} from '../BarChartViewer/mockData'
import variableStar from '../../helpers/mockLightCurves/variableStar'
import readme from './README.md'
import backgrounds from '../../../../../../../.storybook/lib/backgrounds'
import image from './mocks/temperature.png'

const config = {
  notes: {
    markdown: readme
  }
}

let zoomCallback

function onZoom(type) {
  zoomCallback(type)
}

function setZoomCallback(callback) {
  zoomCallback = callback
}

const stories = storiesOf('Subject Viewers | VariableStarViewer', module)

stories.addDecorator(withKnobs)
// stories.addParameters({ viewport: { defaultViewport: 'responsive' } })

const { colors } = zooTheme.global

const barJSON = {
  amplitude: variableStarAmplitudeMockData,
  period: variableStarPeriodMockData
}

const focusedSeries = variableStar.data.map((series) => {
  if (series?.seriesData.length > 0) {
    return { [series.seriesOptions.label]: true }
  }
})

const mockStore = {
  classifications: {
    active: {
      annotations: new Map()
    }
  },
  subjectViewer: {
    enableRotation: () => null,
    setOnZoom: setZoomCallback
  },
  workflowSteps: {
    activeStepTasks: []
  }
}

const subject = {
  id: '1',
  locations: [
    { 'application/json': 'https://raw.githubusercontent.com/zooniverse/front-end-monorepo/master/packages/lib-classifier/src/components/Classifier/components/SubjectViewer/helpers/mockLightCurves/variableStar.json' }
  ]
}

function ViewerContext(props) {
  const { children, theme } = props
  return (
    <Provider classifierStore={mockStore}>
      <Grommet theme={zooTheme}>
        {children}
      </Grommet>
    </Provider>
  )
}

stories
  .add('light theme', () => {
    return (
      <ViewerContext>
        <Box height='500px' width='large'>
          <VariableStarViewerContainer
            subject={subject}
          />
        </Box>
      </ViewerContext>
    )
  }, config)
  .add('dark theme', () => {
    const darkZooTheme = Object.assign({}, zooTheme, { dark: true })
    return (
      <Grommet theme={darkZooTheme}>
        <Box height='500px' width='large'>
          <VariableStarViewer
            barJSON={barJSON}
            imgSrc={image}
            phasedJSON={variableStar}
            rawJSON={object('data', variableStar)}
          />
        </Box>
      </Grommet>
    )
  }, { backgrounds: backgrounds.darkDefault, viewport: { defaultViewport: 'responsive' }, ...config })
  .add('narrow view', () => {
    const darkZooTheme = Object.assign({}, zooTheme, { dark: true })
    return (
      <Grommet theme={darkZooTheme}>
        <Box height='500px' width='large'>
          <VariableStarViewer
            barJSON={barJSON}
            imgSrc={image}
            phasedJSON={variableStar}
            rawJSON={object('data', variableStar)}
          />
        </Box>
      </Grommet>
    )
  }, { viewport: { defaultViewport: 'iphone5' }, ...config })