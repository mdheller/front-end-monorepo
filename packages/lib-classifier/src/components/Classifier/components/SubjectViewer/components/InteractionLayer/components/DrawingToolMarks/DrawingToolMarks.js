import React, { useContext } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useTransition, animated } from 'react-spring'
import _ from 'lodash'
import { DeleteButton, Mark } from '@plugins/drawingTools/components'
import SVGContext from '@plugins/drawingTools/shared/SVGContext'

const duration = 3000

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
      const debouncedDeleteMark = _.debounce(tool.deleteMark, (duration + 1000))
      debouncedDeleteMark(mark)
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
    )
  })

  const transitions = useTransition(items, item => item.key, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { duration }
  })

  return transitions.map(({ item, props, key }) =>
    <animated.g key={key} style={props}>{item}</animated.g>
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
