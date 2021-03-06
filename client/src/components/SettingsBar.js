/*******************************************************************
 * Copyright (c) 2016 Portland State University CS Capstone Team
 *
 * Authors: Siggy Hinds, Jiaqi Luo, Christopher Monk, Tristan de Nijs,
 *          Simone Talla Silatchom, Carson Volker, Anton Zipper
 *
 * This file is part of uLabCapstone, distributed under the MIT
 * open source license. For full terms see the LICENSE.md file
 * included in the root of this project.
 *
 *******************************************************************
 * This is the SettingsBar component. It handles all of the user's
 * settings, including the voice they choose, the rate and pitch,
 * which fringe vocabulary they have selected, as well as enabling
 * the EditorMode in the application (for deleting words), and
 * an AddNewWord button, which opens the WordEditor component and
 * allows the user to add a new Word. There is also a Lock button,
 * which disables all functionality in the SettingsBar so that a user
 * cannot accidentally change a bunch of settings.
 *******************************************************************/


import React, {Component} from 'react';
import {Modal, Glyphicon} from 'react-bootstrap';
import WordEditor from './WordEditor.js';


class SettingsBar extends Component {
  /**
   * Constructor
   * @param props : The parent (see ../App.js)
   */
  constructor(props) {
    super(props);

    this.renderLock = this.renderLock.bind(this);

    var voices = speechSynthesis.getVoices();

    this.state = {
      selectedVoice: voices[0] && voices[0].value,
      selectedFringe: "",
      fringeListTitles: this.props.fringeListTitles,
      voices,
    }
  }

  /**
   * componentDidUpdate()
   * Runs when the component successfully updated
   */
  componentDidUpdate() {
    this.props.disableEditorIfLocked();
  }


  /**
   * renderLock()
   * Locks the Settings Bar so that all functionality is inaccessible,
   * with the exception of the lock toggle button itself.
   */
  renderLock() {
    // Check the checkbox if the settingsLocked prop is true
    // let checked = this.props.settingsLocked ? 'checked' : '';

    console.log("settings is locked: ", this.props.settingsLocked);

    let lock = this.props.settingsLocked
      ? <Glyphicon className="Locked" glyph="glyphicon glyphicon-lock" aria-hidden="true"/>
      : <i className="fa fa-unlock" aria-hidden="true"></i>;

    return (
      <div className={"LockSetting" + (this.props.settingsLocked ? '-locked' : '')} onClick={this.props.lockToggle}>
        <span className="Lock">{lock}</span>
      </div>
    );
  }


  /**
   * Basic React render function, renders the component.
   */
  render() {
    // Disable the dropdown menu if the settingsLocked prop is true
    let disabled = this.props.settingsLocked ? 'disabled' : '';
    console.log(this.state.fringeListTitles);

    // Change the text on the delete button depending on whether EditorMode is enabled or not
    let deleteText = this.props.editorToggle ? 'Finish Deleting' : 'Delete a Word';

    return (
      <div className="SettingsBar">

        {/* Voice Form - Options */}
        <form className="VoiceForm">
          <label className={"VoiceLabel" + (this.props.settingsLocked ? '-locked' : '')}>Voice
          <select className="VoiceMenu" defaultValue={this.state.selectedVoice} disabled={disabled}
                  onChange={(e) => {
                        this.setState({selectedVoice: e.target.value});
                        this.props.updateVoice(e)
                      }}>
            {
              this.state.voices.map((voice) => {
                return <option key={voice.name} value={voice && voice.value}>{voice.name}</option>
              })
            }
          </select>

          {/* Voice Speed Slider */}
          <label className="VoiceControl">Speed
          <input type="range" className="VoiceRateSlider" min="1" max="20"
                 value={this.props.selectedVoiceRate}
                 onChange={this.props.updateVoiceRate} disabled={disabled}></input>
          </label>
          {/* Voice Pitch Slider */}
          <label className="VoiceControl">Pitch
          <input type="range" className="VoicePitchSlider" min="1" max="20"
                 value={this.props.selectedVoicePitch}
                 onChange={this.props.updateVoicePitch} disabled={disabled}></input>
          </label>

          </label> {/* end of Voice Label (orange) */}

        </form>

        {/* Drop Down for changing which Fringe List we want */}
        <label className={"FringeLabel" + (this.props.settingsLocked ? '-locked' : '')}>Fringe Words
        <select className="FringeListsMenu" defaultValue={this.props.selectedFringe}

                onChange={(e) => {
                    this.setState({selectedFringe: e.target.value});
                    this.props.updateFringeChoice(e)
                }}>
          {
            this.state.fringeListTitles.map((title) => {
              return <option key={title} value={title}>{title}</option>
            })
          }
        </select>
        </label>

        {/* Add Button */}
        <button className={"AddButton" + (this.props.settingsLocked ? '-locked' : '')} onClick={this.props.open}
                disabled={disabled}>Add New Word
        </button>
        <Modal
          contentLabel="Modal"
          aria-labelledby='modal-label'
          show={this.props.showModal}
          onHide={this.props.close}>
          <WordEditor
            selectedVoiceRate={this.props.selectedVoiceRate}
            selectedVoicePitch={this.props.selectedVoicePitch}
            coreListTitles={this.props.coreListTitles}
            fringeListTitles={this.props.fringeListTitles}
            close={this.props.close}
            handleAddNewWord={this.props.handleAddNewWord}
            handleAddNewImage={this.props.handleAddNewImage}/>
        </Modal>

        {/* Editor Button, allows you to delete words */}
        <button className={"EditorButton"+ (this.props.settingsLocked ? '-locked' : '')}
                onClick={this.props.enableEditorMode} disabled={disabled}>
          {deleteText}
        </button>

        <label className="closeSettings" onClick={this.props.settingsToggle}><Glyphicon className="closeSettings-glyph" glyph="glyphicon glyphicon-remove" aria-label="Close Settings Bar"/>
          Close </label>

        { this.renderLock() }


      </div>
    );
  }
}

// <div className={"btn-group pull-right " + (this.props.showBulkActions ? 'show' : 'hidden')}>


SettingsBar.propTypes = {
  updateVoice: React.PropTypes.func,
  updateVoiceRate: React.PropTypes.func,
  updateVoicePitch: React.PropTypes.func,
  updateFringeChoice: React.PropTypes.func,
  selectedVoiceRate: React.PropTypes.string,
  selectedVoicePitch: React.PropTypes.string,
  lockToggle: React.PropTypes.func,
  enableEditorMode: React.PropTypes.func,
  open: React.PropTypes.func,
  close: React.PropTypes.func,
  handleAddNewWord: React.PropTypes.func,
  handleAddNewImage: React.PropTypes.func,
  settingsToggle: React.PropTypes.func,
};

SettingsBar.defaultProps = {
  fringeListTitles: ["Goodnight Moon", "Hello world"],
};
export default SettingsBar;
