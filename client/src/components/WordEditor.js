/***************************************************************
 * Copyright (c) 2016 Universal Design Lab. All rights reserved.
 *
 * This file is part of uLabCapstone, distibuted under the MIT
 * open source licence. For full terms see the LICENSE.md file
 * included in the root of this project.
 **************************************************************/

import React, {Component} from 'react';
import {Row, Col} from 'react-bootstrap';
// import Dropzone from 'react-dropzone';
// import request from 'superagent';
import {Button} from 'react-bootstrap';
import '../css/WordEditor.css';




class WordEditor extends Component {
  constructor(props) {

    super(props);

    this.setWordText = this.setWordText.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleImageChange = this._handleImageChange.bind(this);

    this.state = {
      file: '',
      imagePreviewURL: '',
      selectedTitle: '',
      wordText: '',
      imgUrl: '',
    };

  }

  _handleSubmit(e) {
    e.preventDefault();

    // 1. write file to folder
    // TODO: do something with -> this.state.file
    // FIle Uploader???
    console.log('file name: ', this.state.file.name );
    console.log('handle uploading-', this.state.file);


    // 2. POST api call to save
    // fetch('http://localhost:3001/api/words/', {
    //   method: 'POST',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     name: this.state.wordText,
    //     path: '',
    //     text: this.state.wordText,
    //     list: this.state.selectedTitle
    //   })
    // })

    console.log('Submit New Word: ');
    this.props.handleAddNewWord(this.state.wordText, this.state.selectedTitle );

    this.props.close(); //close modal
  }


  _handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    }

    reader.readAsDataURL(file)
  }


  setWordText(e){
    this.setState({wordText: e.target.value});
  }


  render() {
    let {imagePreviewUrl} = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} role="presentation"/>);
    } else {
      $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
    }



    return (
      <div className="WordEditor">
        <h1>Add New Word</h1>

        <Row >
          <Col xs={12} md={6} lg={6}>
            <div className="imgPreview"> {$imagePreview} </div>
            <div className="wordPreview">{this.state.wordText} </div>
          </Col>

          <Col xs={12} md={6} lg={6}>
            <form className="AddNewWordForm">
              <label> New Word Text: </label>
              <input type="text" name="word_text" className="WordTextInput" placeholder="Enter text" onChange={this.setWordText}/>

              <Row>
                <Col xs={12}>
              <label>Choose an Image: </label>
                </Col>
                <Col xs={12}>
              <input type="file" name="filename" className="FileInputButton"
                     onChange={(e) => this._handleImageChange(e)}
                     accept="image/gif, image/jpeg, image/png, image/jpg"/>
                </Col>
              </Row>

              <label>Add to List: </label>

              <select className="ListTitles" defaultValue={this.state.selectedTitle}
                      onChange={(e) => {
                        this.setState({selectedTitle: e.target.value})
                      }}>
                {
                  this.props.coreListTitles.map((title) => {
                    return <option key={title} value={title}>{title}</option>
                  })
                }
              </select>
            </form>

          </Col>
        </Row>

        <div className="modal-footer">

          <Button className="CancelNewWord" bsStyle="danger" onClick={this.props.close}>Cancel</Button>
          <Button type="submit" className="SaveNewWord" bsStyle="primary" onClick={this._handleSubmit}>Save</Button>

        </div>


      </div>


      // <Dropzone multiple={false}
      //     accept="image/jpg,image/png,image/gif"
      //     onDrop={this.onImageDrop}>
      //     <p>Drop an image or click to select a file to upload.</p>
      // </Dropzone>
    );

  }
}

WordEditor.propTypes = {
  close: React.PropTypes.func,
  handleAddNewWord: React.PropTypes.func,
};


export default WordEditor;
