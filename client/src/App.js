/*******************************************************************
 * Copyright (c) 2016 Portland State University CS Capstone Team
 *
 * Authors: Siggy Hinds, Jiaqi Luo, Christopher Monk, Tristan de Nijs,
 *          Simone Talla Silatchom, Carson Volker, Anton Zipper
 *
 * This file is part of uLabCapstone, distributed under the MIT
 * open source license. For full terms see the LICENSE.md file
 * included in the root of this project.
 *******************************************************************
 * This is the App component. App is the master component of the
 * entire application, and handles message passing, holding values,
 * and is the parent class for all minor components. It is the back-
 * bone of this application, and therefore the most important.
 *******************************************************************/


import React, {Component} from 'react';
import './css/App.css';
import './css/SpeechBar.css';
import './css/SettingsBar.css';
import './css/font-color.css';
import './css/Grid-Column-Word.css';
import SpeechBar from './components/SpeechBar.js';
import SettingsBar from './components/SettingsBar';
import Vocab from './components/Vocab';
import _ from 'lodash';
import $ from 'jquery';
import {Button, Modal, Grid, Row} from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);

    this.settingsToggle = this.settingsToggle.bind(this);
    this.handleClearMessage = this.handleClearMessage.bind(this);
    this.updateVoice = this.updateVoice.bind(this);
    this.updateVoiceRate = this.updateVoiceRate.bind(this);
    this.updateVoicePitch = this.updateVoicePitch.bind(this);
    this.updateFringeChoice = this.updateFringeChoice.bind(this);
    this.updateFringeChoiceSynch = this.updateFringeChoiceSynch.bind(this);
    this.lockToggle = this.lockToggle.bind(this);
    this.enableEditorMode = this.enableEditorMode.bind(this);
    this.addWordToSpeechBar = this.addWordToSpeechBar.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.getWords = this.getWords.bind(this);
    this.getFringeWords = this.getFringeWords.bind(this);
    this.appendToCols = this.appendToCols.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.getCoreVocabTitles = this.getCoreVocabTitles.bind(this);
    this.getFringeVocabTitles = this.getFringeVocabTitles.bind(this);
    this.removeFromGrid = this.removeFromGrid.bind(this);
    this.handleAddNewWord = this.handleAddNewWord.bind(this);
    this.handleAddNewImage = this.handleAddNewImage.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);
    this.renderRemoveWordModal = this.renderRemoveWordModal.bind(this);
    this.callDeleteApi = this.callDeleteApi.bind(this);
    this.renderSettingsBar = this.renderSettingsBar.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.disableEditorIfLocked = this.disableEditorIfLocked.bind(this);

    this.state = {
      selectedVoice: "Default",
      selectedVoiceRate: "10",
      selectedVoicePitch: "10",
      settingsBarVisible: false,
      settingsLocked: false,
      editorToggle: false,
      buttonSize: "5",
      colArray: [], // core vocab
      fringeColArray: [], // fringe vocab
      messageArray: [],
      coreListTitles: [],
      fringeListTitles: [],
      listIds: [],
      selectedFringe: "",
      selectedFringeId: "0",
      showModal: false,
      showDeleteModal: false,
      deleteWordText: "",
      deleteWordId: "0",
      deleteColId: "0",
      hostname: "localhost:3001",

      // maxWidth: 768,        // arbitrary default maxWidth for update dimensions function
      // maxHeight: 920,
    }

  }




  /**
   * componentWillMount()
   * This function is run before component mounts.
   * Gets the vocab and fringe titles.
   */
  componentWillMount() {
    this.getCoreVocabTitles();
    this.getFringeVocabTitles();

    //this.updateDimensions();     // update dimensions when mounting
    window.addEventListener("resize", this.updateDimensions());    // add event listener for update dimensions
  }

  /**
   * componentDidMount()
   * This function is run when the component has mounted.
   * Gets the vocab and fringe words
   */
  componentDidMount() {
    this.getWords(); // get words for main core vocabulary
    this.getFringeWords(); // get words for fringe vocabulary

    console.log('Component Mounted:');
    console.log('CoreListTitles: ', this.state.coreListTitles);
  }



  /**
   * updateDimensions()
   * Calculate & Update state of new dimensions
   *
   * Some important device dimensions
   * ipad portrait  { w = 768px h = 920px }
   * ipad landscape { w = 1010px h = 660px }
   * iphone portrait  { w = 310px h = 352}
   * iphone landscape { w = 468px h = 202}
   * reasonable desktop screen resolution { w=1280px h=800px }
   *
   */
  updateDimensions() {
    console.log("updateDimensions called: width:", window.innerWidth, " height: ", window.innerHeight);

    if(window.innerHeight < 202 ) {
      this.setState({maxHeight: 200});
      //this.setState({maxVocabHeight: })

    }
    if(window.innerHeight < 352 ) {
      this.setState({maxHeight: 340});

    }
    if(window.innerHeight < 660 ) {
      this.setState({maxHeight: 650});

    }
    if(window.innerHeight < 800 ) {
      this.setState({maxHeight: 790});

    }
    else {  // 900
      this.setState({maxHeight: 850});
    }


    console.log('Dimensions: width- ', this.state.maxWidth,
      '  height- ', this.state.maxWidth);
  }



  /**
   * getFringeWords()
   * makes api call to database to pull the list of words from the "FringeVocabGrid"
   * updates state fringeColArray
   * */
  getFringeWords() {
    let fringelist = [];
    console.log(this.state.fringeListTitles);
    var title;
    var selectedList;
    var list_id;
    if(this.state.fringeListTitles.length === 0) {
    	title = "goodnight moon";
        list_id = 9;
    } else {
        // Lookup the correct list_id for the given fringe title
        title = this.state.selectedFringe;
        selectedList = this.state.listIds.filter((el) => {
          return el.title === title;
        });
        list_id = selectedList[0].id;
    }

    console.log(this.state.selectedFringe);
    console.log(title);

    this.setState({fringeColArray: []});  // getWords() will be called when a new word is added,
    // so need to clear the fringeColArray before retrieving words from ap

      $.getJSON('http://'+ this.state.hostname + '/api/lists/title/' + title)
        .then((data) => {
          fringelist = {
            order: 1,
            id: list_id,
            title: title,
            words: data
          };
          this.setState({fringeColArray: [fringelist]});
        });

    console.log("GetFringe: fringelist: ", fringelist);
    console.log("GetFringe: fringeColArray: ", this.state.fringeColArray);
  }

  /**
   * getWords()
   * makes api call, Initializes wordArrays with JSON data from API call
   * calls appendToCols to add additional lists of words
   * */
  getWords() {
    let nextCol;
    let titles = [
      {title: 'pronoun', id: "7", order: "1"},
      {title: 'noun', id: "5", order: "2"},
      {title: 'verb', id: "8", order: "3"},
      {title: 'adjective', id: "1", order: "4"},
      {title: 'adverb', id: "2", order: "5"},
      {title: 'questions', id: "3", order: "6"},
      {title: 'preposition', id: "6", order: "7"},
      {title: 'exclamation', id: "4", order: "8"}];

    this.setState({colArray: []});  // getWords() will be called when a new word is added,
                                    // clear the colArray before retrieving words from api

    titles.forEach(({title, id, order}) => {
      $.getJSON('http://'+ this.state.hostname + '/api/lists/title/' + title)
        .then((data) => {
          nextCol = {
            order: order,
            id: id,
            title: title,
            words: data
          };
          this.setState(this.appendToCols(nextCol));
        });
    });
  }


  /**
   * getCoreVocabTitles() 
   * Retrieves the titles of the core vocabulary from the database
   * and updates the state variable "coreListTitles"
   */
  getCoreVocabTitles() {
    let coreVocabId = '1';  // list_id for coreVocab list
    let listTitles = [];

    $.getJSON('http://'+ this.state.hostname + '/api/grids/id/' + coreVocabId)
      .then((data) => {
        _.forEach(data, function (value) {
          listTitles.push(value.list_title);
        });
      })

    this.setState({coreListTitles: listTitles});
  }

  /**
   * getFringeVocabTitles() 
   *  Retrieves the titles of the fringe vocabulary from the database
   * and updates the state variable "fringeListTitles"
   */
  getFringeVocabTitles() {
    let fringeVocabId = '2';  // list_id for fringeVocab list
    let listTitles = [];
    let listIds = [];

    $.getJSON('http://'+ this.state.hostname + '/api/grids/id/' + fringeVocabId)
      .then((data) => {
        _.forEach(data, function (value) {
          listTitles.push(value.list_title);
          listIds.push({title: value.list_title, id: value.list_id});
        });
      })

    this.setState({fringeListTitles: listTitles});
    this.setState({selectedFringe: listTitles[0]});
    this.setState({listIds: listIds});
  }

  /**
   * appendToCols(nextCol)
   * Adds a new column to the colArray
   * @param nextCol : the next column to add to the colArray.
   */
  appendToCols(nextCol) {
    return ((prevState) => {
      return {...prevState, colArray: [...prevState.colArray, nextCol]}
    });
  }


  /**
   * handleBackButton()
   * Callback function passed to the SpeechBar back button removed last item in message
   */
  handleBackButton() {
    if (this.state.messageArray !== []) {
      this.state.messageArray.splice(this.state.messageArray.length - 1, 1);
      this.setState({messageArray: this.state.messageArray});
      console.log(this.state.messageArray)
    }
  }


  /**
   * handleClearMessage()
   * Callback function passed to the SpeechBar clear the speechBarMessage when the clear button is clicked
   */
  handleClearMessage() {
    this.setState({messageArray: []});
  }

  /**
   * updateVoice(e)
   * Callback function passed to the SettingsBar to update the App's selectedVoice state variable
   * @param e : The name of the voice we are changing to
   */
  updateVoice(e) {
    this.setState({selectedVoice: e.target.value});
  }

  /**
   * updateVoiceRate(e)
   * Callback function passed to the SettingsBar to update the App's selectedVoiceRate state variable
   * @param e : The value of the rate we are changing to
   */
  updateVoiceRate(e) {
    this.setState({selectedVoiceRate: e.target.value});
  }

  /**
   * updateVoicePitchi(e)
   * Callback function passed to the SettingsBar to update the App's selectedVoicePitch state variable
   * @param e : The value of the pitch we are changing to
   */
  updateVoicePitch(e) {
    this.setState({selectedVoicePitch: e.target.value});
  }

  /**
   * updateFringeChoice(e)
   * Callback function passed to the SettingsBar to update the App's selectedFringe state variable
   * @param e : The name of the Fringe we are changing to
   */
  updateFringeChoice(e) {

    this.updateFringeChoiceSynch(e).then(() => this.getFringeWords());
    console.log(this.state.selectedFringe);
    console.log(e.target.value);
    //this.getFringeWords();
  }

  /**
   * updateFringeChoiceSynch(e)
   * Function called by updateFringe(e) to fix an asynchronous problem
   * @param e : The name of the Fringe we are changing to
   * @return p : Returns a promise that always promises a success
   */
  updateFringeChoiceSynch(e) {
    var a = e.target.value;
    this.setState({selectedFringe : a});
    var p = new Promise((resolve, reject) => {
           resolve('SUCCESS');
    });
    return p;
  }

  /**
   * settingsToggle()
   * Toggles the settingsBarVisible state variable when the settingsButton is clicked
   */
  settingsToggle() {
    // If the settings bar is going to close and editor mode is enabled, disable it
    if (this.state.settingsBarVisible && this.state.editorToggle) {
      this.enableEditorMode();
    }

    this.setState({settingsBarVisible: !(this.state.settingsBarVisible)});
  }

  /**
   * enableEditorMode()
   * Toggles editorToggle state variable when the Editor Mode button is clicked in SettingsBar
   */
  enableEditorMode() {
    this.setState({editorToggle: !(this.state.editorToggle)});
  }

  /**
   * lockToggle()
   * Callback function passed to the SettingsBar to update the App's settingsLocked state variable
   */
  lockToggle() {
    console.log("settings lockToggle called")
    this.setState({settingsLocked: !(this.state.settingsLocked)});
  }

  /**
   * disableEditorIfLocked()
   * Callback function used by SettingsBar to run in its componentDidUpdate lifecycle method.
   * If the settings bar is locked, disable editor mode.
   */
  disableEditorIfLocked() {
    if (this.state.settingsLocked && this.state.editorToggle) {
      this.enableEditorMode();
    }
  }

  // // Callback function passed to the SettingsBar to update the App's buttonSize state variable
  // resizeButton(e) {
  //   this.setState({buttonSize: e.target.value});
  // }

  /**
   * close()
   * Closes the modal for adding a word
   */
  close() {
    this.setState({showModal: false});
  }

  /**
   * open()
   * Opens the modal for adding a word
   */
  open() {
    this.setState({showModal: true});

    // If editor mode is enabled, disable it
    if (this.state.editorToggle) {
      this.enableEditorMode();
    }
  }


  /**
   * addWordToSpeechBar(word)
   * Callback function passed to the Word Component to add a word to the speechBarMessage
   * @param word : The word to be passed into the Speech Bar (See components/SpeechBar.js)
   */
  addWordToSpeechBar(word) {
    let newWord = {
      id: _.uniqueId(),
      word: word.word,
      src: word.src,
      alt: word.alt
    };

    console.log("add word: ", newWord);

    this.setState({
      messageArray: [
        ...this.state.messageArray,
        newWord
      ]
    });
  }

  /**
   * openDeleteModal()
   * Opens the modal for delete confirmation
   */
  openDeleteModal() {
    this.setState({showDeleteModal: true});
  }

  /**
   * closeDeleteModal()
   * Closes the modal for delete confirmation
   */
  closeDeleteModal() {
    this.setState({showDeleteModal: false});
  }

  /**
   * handleDelete(word_text, word_id, col_id)
   * Callback function passed to Word component to remove that word from the grid.
   * Updates state related to the delete confirmation modal and opens the modal.
   * @param word_text : the text we need to delete
   * @param word_id : the id of the word we are deleting
   * @param col_id : the id of the column from which the word is being deleted
   */
  handleDelete(word_text, word_id, col_id) {
    this.setState({deleteWordText: word_text});
    this.setState({deleteWordId: word_id});
    this.setState({deleteColId: col_id});
    this.openDeleteModal();
  }

  /**
   * handleDeleteConfirm()
   * Updates the app's state, call's the backend API to delete from the database,
   * and closes the delete confirmation modal.
   */
  handleDeleteConfirm() {
    this.removeFromGrid(this.state.deleteWordId, this.state.deleteColId);
    this.callDeleteApi(this.state.deleteWordId, this.state.deleteColId);
    this.closeDeleteModal();
  }

  /**
   * removeFromGrid(word_id, col_id)
   * Updates the local state to remove the desired word from the desired column.
   * @param word_id : the id of the word that we are deleting
   * @param col_id : the id of the column from which the word is being deleted
   */
  removeFromGrid(word_id, col_id) {
    console.log("wordId: " + word_id + " columnId: " + col_id);

    let col = 0;
    let newCols = 0;

    if(col_id > 8) {
      col = this.state.fringeColArray.filter((el) => {
        return el.id === col_id;
      });
      newCols = this.state.fringeColArray.filter((el) => {
        return el.id !== col_id;
      });
    }else {
      // Get the column to remove from
      col = this.state.colArray.filter((el) => {
        return el.id === col_id;
      });

      // Get a new set of columns that has the column we want to alter removed
      newCols = this.state.colArray.filter((el) => {
        return el.id !== col_id;
      });
    }


    // Pull the column from the filter results
    col = col[0];


    // Get the new array of words with the desired word removed
    let newWords = col.words.filter((el) => {
      return el.word_id !== word_id;
    });

    // Assemble the new column with the filtered words
    let newCol = {
      ...col,
      words: newWords,
    };

    // Update the state and add the updated column back on
    if(col_id > 8) {
      this.setState({
        fringeColArray: [
          ...newCols, newCol
        ]
      });
    }else{
      this.setState({
        colArray: [
          ...newCols, newCol
        ]
      });
    }
  }


  /**
   * handleAddNewImage()
   * {API POST CALL}
   * Callback function passed to the WordEditor Component to add a image through POST api call
   * @param formData : The data collection that needs to be added into the database
   */
  handleAddNewImage(formData) {
    $.ajax({
      contentType: false,
      processData: false,
      method: 'POST',
      url: 'http://'+ this.state.hostname + '/api/imgupload',
      data: formData
    })
  }




  /**
   * callDeleteApi(word_id, list_id)
   * {API DELETE CALL}
   * Called by handleDeleteConfirm to remove the specified word from the specified list in the database
   * @param word_id : the id of the word that we are deleting
   * @param col_id : the id of the column from which the word is being deleted
   */
  callDeleteApi(word_id, list_id) {
    let address = 'http://'+ this.state.hostname + '/api/words/list_id/' + list_id + '/word_id/' + word_id;
    $.ajax({
      method: 'DELETE',
      url: address,
      data: JSON.stringify({
        word_id: word_id,
        list_id: list_id,
      })
    });
  }


  /**
   * handleAddNewWord()
   * {API POST CALL}
   * Callback function passed to the WordEditor Component to add a word through POST api call
   * @param wordText : The text of the word that is being added
   * @param selectedTitle : The title of the list that the word is being added to
   * @param selectedVocabulary : The name of the vocabulary that the word is being added to
   * @param fileSelected : The image file that is being passed in
   */
  handleAddNewWord(wordText, newFileName, selectedTitle, selectedVocabulary, fileSelected) {
    var newPath = (fileSelected && newFileName !== '') ?
                  'img/' + newFileName
                : 'img/blank.png';
    var apiCall = 'http://'+ this.state.hostname + '/api/words/';
    var newWordText = wordText + 'symbol';
    var newGrid = selectedVocabulary + ' vocabulary';

    $.ajax({
      type: 'POST',
      url:apiCall,
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        name: wordText,
        path: newPath,
        text: newWordText,
        list: selectedTitle,
        grid: newGrid
      })
    })
    .then(() => {this.getWords(); this.getFringeWords()});
    //then... call getWords() to reload words
  }


  /**
   * renderRemoveWordModal
   * Renders the modal that appears to confirm deleting a button
   */
  renderRemoveWordModal() {
    return (
      <Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal}>
        <Modal.Body>
          <p>Are you sure you want to delete "{this.state.deleteWordText}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.handleDeleteConfirm}>Yes</Button>
          <Button onClick={this.closeDeleteModal}>No</Button>
        </Modal.Footer>
      </Modal>
    )
  }


  /**
   * renderSettingsBar()
   * a helper function that returns the SettingsBar component
   * */
  renderSettingsBar() {
    return (
      <SettingsBar selectedVoice={this.state.selectedVoice} updateVoice={this.updateVoice}
                   updateVoiceRate={this.updateVoiceRate} updateVoicePitch={this.updateVoicePitch}
                   selectedVoiceRate={this.state.selectedVoiceRate} selectedVoicePitch={this.state.selectedVoicePitch}
                   selectedFringe={this.state.selectedFringe} updateFringeChoice={this.updateFringeChoice}
                   settingsLocked={this.state.settingsLocked} lockToggle={this.lockToggle}
                   settingsToggle={this.settingsToggle}
                   editorToggle={this.state.editorToggle} enableEditorMode={this.enableEditorMode}
                   buttonSize={this.state.buttonSize} resizeButton={this.resizeButton}
                   open={this.open} close={this.close} showModal={this.state.showModal}
                   coreListTitles={this.state.coreListTitles} handleAddNewWord={this.handleAddNewWord}
                   handleAddNewImage={this.handleAddNewImage} disableEditorIfLocked={this.disableEditorIfLocked}
                   fringeListTitles={this.state.fringeListTitles}/>
    )
  }

  /**
   * Basic React render function, renders the component.
   */
  render() {

    //Get the Browser's voices loaded before anything. Allows syncing
    //of SettingsBar voices
    speechSynthesis.getVoices();

    // Render the SettingsBar only if the settingsBarVisible state variable is true
    let settingsBar = this.state.settingsBarVisible
      ? this.renderSettingsBar()
      : null;


    // fix below when the function to detect the window height works...
    // <Grid className="LayoutGrid" fluid="true" style={{ height: this.state.maxHeight }} >


    return (
      <div className="App">

        <Grid className="LayoutGrid">
          <Row className="SpeechSettingsRow">
            <SpeechBar
              message={this.state.messageArray}
              handleClearMessage={this.handleClearMessage}
              selectedVoice={this.state.selectedVoice}
              selectedVoiceRate={this.state.selectedVoiceRate}
              selectedVoicePitch={this.state.selectedVoicePitch}
              handleBackButton={this.handleBackButton}
              settingsToggle={this.settingsToggle}/>

            <div className="Settings">
              {settingsBar}
            </div>
          </Row>

          <Row className="FringeVocabRow"  >

            <div className="FringeCol">
              <Vocab cols={this.state.fringeColArray} add={this.addWordToSpeechBar}
                     selectedVoice={this.state.selectedVoice} selectedVoiceRate={this.state.selectedVoiceRate}
                     selectedVoicePitch={this.state.selectedVoicePitch} editorToggle={this.state.editorToggle}
                     removeFromGrid={this.handleDelete}/>
            </div>

            <div className="VocabCol">
              <Vocab
                     cols={this.state.colArray} add={this.addWordToSpeechBar}
                     selectedVoice={this.state.selectedVoice} selectedVoiceRate={this.state.selectedVoiceRate}
                     selectedVoicePitch={this.state.selectedVoicePitch} editorToggle={this.state.editorToggle}
                     removeFromGrid={this.handleDelete}/>
            </div>

            {this.renderRemoveWordModal()}

          </Row>

        </Grid>
      </div>


    );
  }
}

export default App;
