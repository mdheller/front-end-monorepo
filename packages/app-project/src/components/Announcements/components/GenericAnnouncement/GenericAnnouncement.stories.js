import { withKnobs, boolean, select, text } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import zooTheme from '@zooniverse/grommet-theme'
import { Grommet } from 'grommet'
import React from 'react'

import GenericAnnouncement from './GenericAnnouncement'
import readme from './README.md'

const ANNOUNCEMENT = 'Neque magnis massa cum elementum dignissim nibh congue facilisis suscipit dictumst, porta hac porttitor praesent purus velit nullam nascetur eu ultricies libero, ipsum viverra molestie orci mollis faucibus habitant a placerat.'

const zooThemeColors = Object.keys(zooTheme.global.colors).filter((color) => {
  return typeof zooTheme.global.colors[color] === 'string'
})

storiesOf('Project App / Screens / Project Home / Announcements / GenericAnnouncement', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Grommet theme={zooTheme}>
      <GenericAnnouncement
        announcement={text('Announcement', ANNOUNCEMENT)}
        color={select('color', zooThemeColors, 'neutral-4')}
        dismissable={boolean('dismissable', false)}
      />
    </Grommet>
  ), {
    notes: {
      markdown: readme
    }
  })
