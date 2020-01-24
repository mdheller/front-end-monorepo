import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Transition, TransitionGroup } from 'react-transition-group'
import _ from 'lodash'
import { DeleteButton, Mark } from '@plugins/drawingTools/components'
import SVGContext from '@plugins/drawingTools/shared/SVGContext'

const duration = 1000

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 0
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 1 },
  exited: { opacity: 0 }
}

function DrawingToolMarks ({ activeMarkId, onDelete, onDeselectMark, onSelectMark, scale, marks }) {
  const { svg } = useContext(SVGContext)

  const items = marks.map((mark, index) => {
    const { tool } = mark
    const MarkingComponent = observer(mark.toolComponent)
    const ObservedDeleteButton = observer(DeleteButton)
    const isActive = mark.id === activeMarkId

    function isInBounds (markElement) {
      const object = markElement.getBoundingClientRect()
      const bounds = svg.getBoundingClientRect()
      const notBeyondLeft = (object.left + object.width) > bounds.left
      const notBeyondRight = object.left < (bounds.left + bounds.width)
      const notBeyondTop = (object.top + object.height) > bounds.top
      const notBeyondBottom = object.top < (bounds.top + bounds.height)
      return notBeyondLeft && notBeyondRight && notBeyondTop && notBeyondBottom
    }

    function deleteMark () {
      const debouncedToolDelete = _.debounce(tool.deleteMark, (duration + 1000))
      debouncedToolDelete(mark)
      const debouncedOnDelete = _.debounce(onDelete, (duration + 1000))
      debouncedOnDelete(mark)
    }

    function moveMark (event, difference) {
      mark.move(difference)
    }

    function deselectMark (event) {
      onDeselectMark(mark)
      if (!isInBounds(event.currentTarget)) {
        deleteMark()
      }
    }

    function selectMark () {
      onSelectMark(mark)
    }

    return (
      <Transition
        key={mark.id}
        timeout={duration}
        component='g'
      >
        {state => (
          <g
            key={mark.id}
            style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}
          >
            <Mark
              key={mark.id}
              isActive={isActive}
              coords={mark.coords}
              dragStart={selectMark}
              dragMove={moveMark}
              dragEnd={deselectMark}
              label={`Mark ${index}`}
              mark={mark}
              onDelete={deleteMark}
              onDeselect={onDeselectMark}
              onSelect={onSelectMark}
              scale={scale}
            >
              <MarkingComponent
                active={isActive}
                mark={mark}
                scale={scale}
              />
              {isActive && <ObservedDeleteButton
                label={`Delete ${tool.type}`}
                mark={mark}
                scale={scale}
                onDelete={deleteMark}
              />}
            </Mark>
          </g>
        )}
      </Transition>
    )
  })
  return (
    <TransitionGroup component={null}>
      {items}
    </TransitionGroup>
  )
}

DrawingToolMarks.propTypes = {
  activeMarkId: PropTypes.string,
  marks: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onDeselectMark: PropTypes.func,
  onSelectMark: PropTypes.func,
  scale: PropTypes.number
}

DrawingToolMarks.defaultProps = {
  activeMarkId: '',
  onDelete: () => true,
  onDeselectMark: () => true,
  onSelectMark: () => true,
  scale: 1
}

export default DrawingToolMarks
