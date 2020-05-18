import asyncStates from '@zooniverse/async-states'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React from 'react'
import getViewer from './helpers/getViewer'

function storeMapper (stores) {
  const { active: subject, loadingState: subjectQueueState } = stores.classifierStore.subjects
  const {
    onSubjectLocationLoad,
    onError,
    loadingState: subjectViewerState
  } = stores.classifierStore.subjectViewer

  return {
    onError,
    onSubjectLocationLoad,
    subject,
    subjectQueueState,
    subjectViewerState
  }
}

@inject(storeMapper)
@observer
class SubjectViewer extends React.Component {
  [asyncStates.initialized] () {
    return null
  }

  [asyncStates.loading] () {
    return (<div>Loading</div>)
  }

  [asyncStates.error] () {
    console.error('There was an error loading the subjects')
    return null
  }

  [asyncStates.success] () {
    const { onError, onSubjectLocationLoad, subject, subjectViewerState } = this.props
    const Viewer = getViewer(subject?.viewer)

    if (Viewer) {
      return (
        <Viewer
          key={subject.id}
          subject={subject}
          loadingState={subjectViewerState}
          onError={onError}
          onSubjectLocationLoad={onSubjectLocationLoad}
        />
      )
    }

    return null
  }

  render () {
    const { subjectQueueState } = this.props
    return this[subjectQueueState]() || null
  }
}

SubjectViewer.wrappedComponent.propTypes = {
  subjectQueueState: PropTypes.oneOf(asyncStates.values),
  subject: PropTypes.shape({
    viewer: PropTypes.string
  })
}

SubjectViewer.wrappedComponent.defaultProps = {
  subjectQueueState: asyncStates.initialized
}

export default SubjectViewer
