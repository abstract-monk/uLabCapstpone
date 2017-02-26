import React, {Component} from 'react';
import './css/App.css';
import './css/SpeechBar.css';
import './css/SettingsBar.css';
import './css/font-color.css';
import './css/Grid-Column-Word.css';
import SpeechBar from './components/SpeechBar.js';
import SettingsBar from './components/SettingsBar';
import Grid from './components/Grid';
import _ from 'lodash';
import $ from 'jquery';
import { Button, Modal } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);

    this.settingsToggle = this.settingsToggle.bind(this);
    this.handleClearMessage = this.handleClearMessage.bind(this);
    this.updateVoice = this.updateVoice.bind(this);
    this.lockToggle = this.lockToggle.bind(this);
    this.enableEditorMode = this.enableEditorMode.bind(this);
    this.addWordToSpeechBar = this.addWordToSpeechBar.bind(this);
    this.handleBackButton = this.handleBackButton.bind(this);
    this.getWords = this.getWords.bind(this);
    this.appendToCols = this.appendToCols.bind(this);
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.getCoreVocabTitles = this.getCoreVocabTitles.bind(this);
    this.removeFromGrid = this.removeFromGrid.bind(this);
    this.handleAddNewWord = this.handleAddNewWord.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.closeDeleteModal = this.closeDeleteModal.bind(this);

    // component render helper functions
    this.renderSettingsBar = this.renderSettingsBar.bind(this);


    this.state = {
      selectedVoice: "Default",
      settingsBarVisible: false,
      settingsLocked: false,
      editorToggle: false,
      buttonSize: "5",
      colArray: [],
      messageArray: [],
      coreListTitles: [],
      showModal: false,
      showDeleteModal: false,
      deleteWordText: "",
      deleteWordId: "0",
      deleteColId: "0",
    }
  }

  componentWillMount() {
    this.getCoreVocabTitles();
  }

  componentDidMount() {
    this.getWords();

    console.log('Component Mounted:');
    console.log('CoreListTitles: ', this.state.coreListTitles);
  }

  // Initializes wordArrays with JSON data from API call
  getWords() {
    let nextCol;
    let titles = [
      {title: 'pronoun', id: "6", order: "1"},
      {title: 'noun', id: "4", order: "2"},
      {title: 'verb', id: "7", order: "3"},
      {title: 'adjective', id: "1", order: "4"},
      {title: 'adverb', id: "2", order: "5"},
      {title: 'preposition', id: "5", order: "6"},
      {title: 'exclamation', id: "3", order: "7"}];

    this.setState({colArray: []});  // getWords() will be called when a new word is added,
                                    // clear the colArray before retrieving words from api

    titles.forEach(({title, id, order}) => {
      $.getJSON('http://localhost:3001/api/lists/title/' + title)
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
   * getCoreVocabTitles()   Retrieves the titles of the core vocabulary from the database
   * and updates the state variable "coreListTitles"
   */
  getCoreVocabTitles() {
    let coreVocabId = '1';  // list_id for coreVocab list
    let listTitles = [];

    $.getJSON('http://localhost:3001/api/grids/id/' + coreVocabId)
      .then((data) => {
        _.forEach(data, function (value) {
          listTitles.push(value.list_title);
        });
      })

    this.setState({coreListTitles: listTitles});
  }


  // Updates the colArray with the next column
  appendToCols(nextCol) {
    return ((prevState) => {
      return {...prevState, colArray: [...prevState.colArray, nextCol]}
    });
  }


  // Callback function passed to the SpeechBar back button removed last item in message
  handleBackButton() {
    if (this.state.messageArray !== []) {
      this.state.messageArray.splice(this.state.messageArray.length - 1, 1);
      this.setState({messageArray: this.state.messageArray});
      console.log(this.state.messageArray)
    }
  }


  // Callback function passed to the SpeechBar clear the speechBarMessage when the clear button is clicked
  handleClearMessage() {
    this.setState({messageArray: []});
  }


  // Callback function passed to the SettingsBar to update the App's selectedVoice state variable
  updateVoice(e) {
    this.setState({selectedVoice: e.target.value});
  }


  // Toggles the settingsBarVisible state variable when the settingsButton is clicked
  settingsToggle() {
    this.setState({settingsBarVisible: !(this.state.settingsBarVisible)});
  }

  //Enables editorToggle state variable when the Editor Mode button is clicked in SettingsBar
  enableEditorMode() {
    this.setState({editorToggle: !(this.state.editorToggle)});
  }

  // Callback function passed to the SettingsBar to update the App's settingsLocked state variable
  lockToggle() {
    this.setState({settingsLocked: !(this.state.settingsLocked)});
  }


  // // Callback function passed to the SettingsBar to update the App's buttonSize state variable
  // resizeButton(e) {
  //   this.setState({buttonSize: e.target.value});
  // }

  //These following 2 functions are setting modal
  close() {
    this.setState({showModal: false});
  }

  open() {
    this.setState({showModal: true});
  }


  // Callback function passed to the Word Component to add a word to the speechBarMessage
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

  openDeleteModal() {
    this.setState({showDeleteModal: true});
  }

  closeDeleteModal() {
    this.setState({showDeleteModal: false});
  }

  handleDelete(word_text, word_id, col_id) {
    this.setState({deleteWordText: word_text});
    this.setState({deleteWordId: word_id});
    this.setState({deleteColId: col_id});
    this.openDeleteModal();
  }

  handleDeleteConfirm() {
    this.removeFromGrid(this.state.deleteWordId, this.state.deleteColId);
    this.closeDeleteModal();
  }

  // Callback function passed to the Word Component to delete that word from the grid
  removeFromGrid(word_id, col_id) {
    console.log("wordId: " + word_id + " columnId: " + col_id);

    // Get the column to remove from
    let col = this.state.colArray.filter((el) =>  {
      return el.id === col_id;
    });

    // Pull the column from the filter results
    col = col[0];

    // Get a new set of columns that has the column we want to alter removed
    let newCols = this.state.colArray.filter((el) => {
      return el.id !== col_id;
    });

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
    this.setState({
      colArray: [
        ...newCols, newCol
      ]
    });
  }


  /**
   * handleAddNewWord()
   * {API POST CALL}
   * Callback function passed to the WordEditor Component to add a word through POST api call
   */
  handleAddNewWord(wordText, selectedTitle) {
    fetch('http://localhost:3001/api/words/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: wordText,
        path: '',
        text: wordText,
        list: selectedTitle
      })
    }).then(() => this.getWords());  //then... call getWords() to reload words
  }


  /**
   * renderSettingsBar()
   * a helper function that returns the SettingsBar component
   * */
  renderSettingsBar() {
    return (
      <SettingsBar selectedVoice={this.state.selectedVoice} updateVoice={this.updateVoice}
                   settingsLocked={this.state.settingsLocked} lockToggle={this.lockToggle}
                   editorToggle={this.state.editorToggled} enableEditorMode={this.enableEditorMode}
                   buttonSize={this.state.buttonSize} resizeButton={this.resizeButton}
                   open={this.open} close={this.close} showModal={this.state.showModal}
                   coreListTitles={this.state.coreListTitles} handleAddNewWord={this.handleAddNewWord}/>
    )
  }


  render() {

    //Get the Browser's voices loaded before anything. Allows syncing
    //of SettingsBar voices
    speechSynthesis.getVoices();

    // Render the SettingsBar only if the settingsBarVisible state variable is true
    let settingsBar = this.state.settingsBarVisible
      ? this.renderSettingsBar()
      : null;

    // let editing = this.state.editorToggle
    //   ? "True"
    //   : "False";

    return (
      <div className="App">

        <SpeechBar
          message={this.state.messageArray}
          handleClearMessage={this.handleClearMessage}
          selectedVoice={this.state.selectedVoice}
          handleBackButton={this.handleBackButton}
          settingsToggle={this.settingsToggle}/>

        <div className="Settings" style={{margin: "auto"}}>
          {settingsBar}
        </div>
        <Grid cols={this.state.colArray} add={this.addWordToSpeechBar}
              selectedVoice={this.state.selectedVoice} editorToggle={this.state.editorToggle}
              removeFromGrid={this.handleDelete}/>
        <Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal}>
            <Modal.Body>
              <p>Are you sure you want to delete "{this.state.deleteWordText}"?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleDeleteConfirm}>Yes</Button>
              <Button onClick={this.closeDeleteModal}>No</Button>
            </Modal.Footer>
          </Modal>
      </div>

    );
  }
}

export default App;
