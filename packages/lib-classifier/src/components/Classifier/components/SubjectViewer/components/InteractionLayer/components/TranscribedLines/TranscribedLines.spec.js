import { mount, shallow } from 'enzyme'
import { Provider } from 'mobx-react'
import sinon from 'sinon'
import React from 'react'
import TranscriptionReductions from '@store/TranscriptionReductions'
import taskRegistry from '@plugins/tasks'
import { TranscribedLines } from './TranscribedLines'
import { reducedSubject } from '@store/TranscriptionReductions/mocks'
import { TranscriptionLine } from '@plugins/drawingTools/components'
import ConsensusPopup from './components/ConsensusPopup'
import zooTheme from '@zooniverse/grommet-theme'

describe('Component > TranscribedLines', function () {
  let wrapper, task, consensusLines
  before(function () {
    const transcriptionReductions = TranscriptionReductions.create({
      reductions: [{ data: reducedSubject }],
      subjectId: '1234',
      workflowId: '5678'
    })
    consensusLines = transcriptionReductions.consensusLines
    const transcriptionModels = taskRegistry.get('transcription')
    task = transcriptionModels.TaskModel.create({
      tools: [{
        type: 'transcriptionLine',
        tasks: [{
          instruction: 'Transcribe the text',
          taskKey: 'T1.0.0',
          type: 'text'
        }]
      }],
      instruction: 'Underline and transcribe the text',
      taskKey: 'T1',
      type: 'transcription'
    })
    task.setActiveTool(0)
  })

  it('should render without crashing', function () {
    wrapper = shallow(<TranscribedLines lines={consensusLines} task={task} />)
    expect(wrapper).to.be.ok()
  })

  describe('when on a step without the transcription task', function () {
    before(function () {
      wrapper = shallow(<TranscribedLines lines={consensusLines} />)
    })

    it('should disable the incomplete lines', function () {
      const transcribedLines = wrapper.find(TranscriptionLine).find({ state: 'transcribed' })
      transcribedLines.forEach((line) => {
        const consensusLineWrapper = line.parent()
        expect(consensusLineWrapper.props()['aria-disabled']).to.equal('true')
      })
    })

    it('should not create a mark', function () {
      const spaceEventMock = { key: ' ', preventDefault: sinon.spy() }
      const enterEventMock = { key: 'Enter', preventDefault: sinon.spy() }
      const transcribedLines = wrapper.find(TranscriptionLine).find({ state: 'transcribed' })
      transcribedLines.forEach((line, index) => {
        expect(task.activeMark).to.be.undefined()
        wrapper.find({ 'aria-describedby': `transcribed-${index}` }).simulate('click')
        expect(task.activeMark).to.be.undefined()
        wrapper.find({ 'aria-describedby': `transcribed-${index}` }).simulate('keydown', spaceEventMock)
        expect(task.activeMark).to.be.undefined()
        wrapper.find({ 'aria-describedby': `transcribed-${index}` }).simulate('keydown', enterEventMock)
        expect(task.activeMark).to.be.undefined()
      })
    })

    it('should not disable the complete lines', function () {
      const completedLines = wrapper.find(TranscriptionLine).find({ state: 'completed' })
      completedLines.forEach((line) => {
        const consensusLineWrapper = line.parent()
        expect(consensusLineWrapper.props()['aria-disabled']).to.be.undefined()
      })
    })
  })

  describe('with all lines', function () {
    before(function () {
      sinon.spy(React, 'createRef')
      wrapper = mount(
        <svg>
          <TranscribedLines
            lines={consensusLines}
            task={task}
            theme={zooTheme}
          />
        </svg>,
        {
          wrappingComponent: Provider,
          wrappingComponentProps: {
            classifierStore: {
              workflows: {
                active: {
                  usesTranscriptionTask: false
                }
              }
            }
          }
        }
      )
    })

    after(function () {
      React.createRef.restore()
    })

    it('should call React createRef for each line', function () {
      expect(React.createRef.callCount).to.equal(consensusLines.length)
    })

    it('should call createMark with expected ref', function () {
      const returnRefs = React.createRef.returnValues
      console.log('returnRefs', returnRefs)
    })
  })

  describe('incomplete lines', function () {
    let lines
    before(function () {
      wrapper = shallow(<TranscribedLines lines={consensusLines} task={task} />)
      lines = wrapper.find(TranscriptionLine).find({ state: 'transcribed' })
    })

    it('should render', function () {
      const transcribedLines = consensusLines.filter(line => !line.consensusReached)
      expect(lines).to.have.lengthOf(transcribedLines.length)
    })

    it('should not be disabled', function () {
      lines.forEach((component) => {
        const consensusLineWrapper = component.parent()
        expect(consensusLineWrapper.props()['aria-disabled']).to.equal('false')
      })
    })

    it('should be focusable', function () {
      lines.forEach((component) => {
        const consensusLineWrapper = component.parent()
        expect(consensusLineWrapper.props().tabIndex).to.equal(0)
      })
    })

    it('should create a new mark on click', function () {
      const transcribedLines = consensusLines.filter(line => !line.consensusReached)
      lines.forEach((line, index) => {
        expect(task.activeMark).to.be.undefined()
        wrapper.find({ 'aria-describedby': `transcribed-${index}` }).simulate('click')
        expect(task.activeMark.x1).to.equal(transcribedLines[index].points[0].x)
        expect(task.activeMark.y1).to.equal(transcribedLines[index].points[0].y)
        expect(task.activeMark.x2).to.equal(transcribedLines[index].points[1].x)
        expect(task.activeMark.y2).to.equal(transcribedLines[index].points[1].y)
        task.setActiveMark(undefined)
      })
    })

    it('should create a new mark on keydown with enter', function () {
      const eventMock = { key: 'Enter', preventDefault: sinon.spy() }
      const transcribedLines = consensusLines.filter(line => !line.consensusReached)
      lines.forEach((line, index) => {
        expect(task.activeMark).to.be.undefined()
        wrapper.find({ 'aria-describedby': `transcribed-${index}` }).simulate('keydown', eventMock)
        expect(task.activeMark.x1).to.equal(transcribedLines[index].points[0].x)
        expect(task.activeMark.y1).to.equal(transcribedLines[index].points[0].y)
        expect(task.activeMark.x2).to.equal(transcribedLines[index].points[1].x)
        expect(task.activeMark.y2).to.equal(transcribedLines[index].points[1].y)
        task.setActiveMark(undefined)
      })
    })

    it('should create a new mark on keydown with space', function () {
      const eventMock = { key: ' ', preventDefault: sinon.spy() }
      const transcribedLines = consensusLines.filter(line => !line.consensusReached)
      lines.forEach((line, index) => {
        expect(task.activeMark).to.be.undefined()
        wrapper.find({ 'aria-describedby': `transcribed-${index}` }).simulate('keydown', eventMock)
        expect(task.activeMark.x1).to.equal(transcribedLines[index].points[0].x)
        expect(task.activeMark.y1).to.equal(transcribedLines[index].points[0].y)
        expect(task.activeMark.x2).to.equal(transcribedLines[index].points[1].x)
        expect(task.activeMark.y2).to.equal(transcribedLines[index].points[1].y)
        task.setActiveMark(undefined)
      })
    })

    it('should have an explanatory tooltip', function () {
      lines.forEach((component, index) => {
        const tooltip = wrapper.find({ id: `transcribed-${index}`})
        expect(tooltip).to.have.lengthOf(1)
      })
    })
  })

  describe('completed lines',function () {
    let lines, completeLines
    before(function () {
      wrapper = shallow(<TranscribedLines lines={consensusLines} task={task} />)
      lines = wrapper.find(TranscriptionLine).find({ state: 'complete' })
      completeLines = consensusLines.filter(line => line.consensusReached)
    })

    it('should render', function () {
      expect(lines).to.have.lengthOf(completeLines.length)
    })

    it('should be labelled with the consensus text', function () {
      lines.forEach((component, index) => {
        const consensusLineWrapper = component.parent()
        expect(consensusLineWrapper.props()['aria-label']).to.equal(completeLines[index].consensusText)
      })
    })

    it('should be focusable', function () {
      lines.forEach((component) => {
        const consensusLineWrapper = component.parent()
        expect(consensusLineWrapper.props().tabIndex).to.equal(0)
      })
    })

    it('should have an explanatory tooltip', function () {
      lines.forEach((component, index) => {
        const tooltip = wrapper.find({ id: `complete-${index}` })
        expect(tooltip).to.have.lengthOf(1)
      })
    })

    it('should show the ConsensusPopup onClick', function () {
      lines.forEach((line, index) => {
        let popup = wrapper.find(ConsensusPopup)
        expect(popup.props().active).to.be.false()
        expect(popup.props().line).to.deep.equal({
          consensusText: '',
          textOptions: []
        })
        wrapper.find({ 'aria-describedby': `complete-${index}`}).simulate('click')
        popup = wrapper.find(ConsensusPopup)
        expect(popup.props().active).to.be.true()
        expect(popup.props().line).to.deep.equal(completeLines[index])
        wrapper.instance().close()
        popup = wrapper.find(ConsensusPopup)
        expect(popup.props().active).to.be.false()
        expect(popup.props().line).to.deep.equal({
          consensusText: '',
          textOptions: []
        })
      })
    })

    it('should show the ConsensusPopup onKeyDown with enter', function () {
      const eventMock = { key: 'Enter', preventDefault: sinon.spy() }
      lines.forEach((line, index) => {
        let popup = wrapper.find(ConsensusPopup)
        expect(popup.props().active).to.be.false()
        expect(popup.props().line).to.deep.equal({
          consensusText: '',
          textOptions: []
        })
        wrapper.find({ 'aria-describedby': `complete-${index}` }).simulate('keydown', eventMock)
        popup = wrapper.find(ConsensusPopup)
        expect(eventMock.preventDefault).to.have.been.calledOnce()
        expect(popup.props().active).to.be.true()
        expect(popup.props().line).to.deep.equal(completeLines[index])
        wrapper.instance().close()
        popup = wrapper.find(ConsensusPopup)
        expect(popup.props().active).to.be.false()
        expect(popup.props().line).to.deep.equal({
          consensusText: '',
          textOptions: []
        })
        eventMock.preventDefault.resetHistory()
      })
    })

    it('should show the ConsensusPopup onKeyDown with space', function () {
      const eventMock = { key: ' ', preventDefault: sinon.spy() }
      lines.forEach((line, index) => {
        let popup = wrapper.find(ConsensusPopup)
        expect(popup.props().active).to.be.false()
        expect(popup.props().line).to.deep.equal({
          consensusText: '',
          textOptions: []
        })
        wrapper.find({ 'aria-describedby': `complete-${index}` }).simulate('keydown', eventMock)
        popup = wrapper.find(ConsensusPopup)
        expect(eventMock.preventDefault).to.have.been.calledOnce()
        expect(popup.props().active).to.be.true()
        expect(popup.props().line).to.deep.equal(completeLines[index])
        wrapper.instance().close()
        popup = wrapper.find(ConsensusPopup)
        expect(popup.props().active).to.be.false()
        expect(popup.props().line).to.deep.equal({
          consensusText: '',
          textOptions: []
        })
        eventMock.preventDefault.resetHistory()
      })
    })
  })
})
