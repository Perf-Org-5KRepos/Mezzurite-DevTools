import React, { Component } from 'react';
import Modal from 'react-modal';

import MezzuriteInspector from '../services/MezzuriteInspector';
import formatTimingsEvent from '../utilities/formatTimingsEvent';
import './App.css';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import HelpDialog from './HelpDialog/HelpDialog';
import Main from './Main/Main';

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      applicationLoadTime: null,
      captureCycles: null,
      helpDialogOpen: false,
      loading: true,
      framework: {
        name: null,
        version: null
      }
    };

    Modal.setAppElement('#root');

    this.onHelpDialogClose = this.onHelpDialogClose.bind(this);
    this.onHelpDialogOpen = this.onHelpDialogOpen.bind(this);
  }

  componentDidMount () {
    MezzuriteInspector.isMezzuritePresentAsync().then((mezzuritePresent) => {
      if (mezzuritePresent) {
        MezzuriteInspector.listenForTimingEvents((timingEvent) => this.handleTimingEvent(timingEvent));
      } else {
        this.setState({ loading: false });
      }
    });
  }

  handleTimingEvent (event) {
    const formattedTimings = formatTimingsEvent(event);

    if (formattedTimings != null) {
      if (formattedTimings.applicationLoadTime != null && this.state.applicationLoadTime == null) {
        this.setState({ applicationLoadTime: formattedTimings.applicationLoadTime });
      }

      if (this.state.framework.name == null && this.state.framework.version == null) {
        this.setState({ framework: formattedTimings.framework });
      }

      if (
        formattedTimings.insideViewportComponents != null ||
        formattedTimings.outsideViewportComponents != null
      ) {
        const captureCycle = {
          insideViewportComponents: formattedTimings.insideViewportComponents,
          outsideViewportComponents: formattedTimings.outsideViewportComponents,
          time: formattedTimings.time,
          viewportLoadTime: formattedTimings.viewportLoadTime
        };

        this.setState((previousState) => {
          if (previousState.captureCycles != null) {
            return { captureCycles: [ captureCycle, ...previousState.captureCycles ] };
          } else {
            return { captureCycles: [ captureCycle ] };
          }
        });
      }

      this.setState({ loading: false });
    }
  }

  onHelpDialogClose () {
    this.setState({ helpDialogOpen: false });
  }

  onHelpDialogOpen () {
    this.setState({ helpDialogOpen: true });
  }

  render () {
    return (
      <div className='app'>
        <Header />
        <Main
          applicationLoadTime={this.state.applicationLoadTime}
          captureCycles={this.state.captureCycles}
          loading={this.state.loading}
          onHelpClick={this.onHelpDialogOpen}
        />
        <Footer packageName={this.state.framework.name} packageVersion={this.state.framework.version} />
        <Modal
          isOpen={this.state.helpDialogOpen}
          className='modal'
          contentLabel='Help Dialog'
          onRequestClose={this.onHelpDialogClose}
          overlayClassName='overlay'
          shouldFocusAfterRender
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          shouldReturnFocusAfterClose
        >
          <HelpDialog
            onCloseClick={this.onHelpDialogClose}
          />
        </Modal>
      </div>
    );
  }
}

export default App;
