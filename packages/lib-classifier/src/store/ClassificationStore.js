import { flow, getRoot, types } from 'mobx-state-tree'
import counterpart from 'counterpart'
import cuid from 'cuid'
import asyncStates from '../helpers/asyncStates'
import Classification from './Classification'
import ResourceStore from './ResourceStore'

const ClassificationStore = types
  .model('ClassificationStore', {
    active: types.maybe(types.reference(Classification)),
    resources: types.map(Classification),
    type: types.optional(types.string, 'classifications')
  })
  .actions(self => {
    function afterAttach() {
      createSubjectObserver()
    }

    function createSubjectObserver() {
      const subjectDisposer = autorun(() => {
        const subject = getRoot(self).subjects.active
        if (subject) {
          self.reset()
          self.createClassification(subject)
        }
      })
      addDisposer(self, subjectDisposer)
    }

    function createClassification(subject) {
      const tempID = cuid()
      const projectID = getRoot(self).projects.active.id
      const workflow = getRoot(self).workflows.active
      const newClassification = Classification.create({
        id: tempID,// Generate an id just for serialization in MST. Should be dropped before POST...
        links: {
          project: projectID,
          subjects: [subject.id],
          workflow: workflow.id
        },
        source: subject.metadata.intervention ? 'sugar' : 'api',
        subject_dimensions: (subject.locations.map(() => null)),
        user_language: counterpart.getLocale(),
        workflow_version: workflow.version
      })

      self.resources.put(newClassification)
      self.setActive(tempID)
      self.loadingState = asyncStates.success
    }

    return {
      afterAttach
    }
  })

export default types.compose(ResourceStore, ClassificationStore)