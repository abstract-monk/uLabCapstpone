/*******************************************************************
 * Copyright (c) 2016 Portland State University CS Capstone Team
 *
 * Authors: Siggy Hinds, Jiaqi Luo, Christopher Monk, Tristan de Nijs,
 *                 Simone Talla Silatchom, Carson Volker, Anton Zipper
 *
 * This file is part of uLabCapstone, distributed under the MIT
 * open source licence. For full terms see the LICENSE.md file
 * included in the root of this project.
 *
 *******************************************************************/

import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import Word from '../src/components/Word.js';
import { speechSynthesis, SpeechSynthesisUtterance } from '../src/mocks';

it('word renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Word />, div);
});

describe("Test suite for mounted Word", () => {
    let word;
    let add;
    let remove;

    beforeEach(() => {
        add = jest.fn();
        remove = jest.fn();
        word = mount(<Word id='1' word="love" src="" alt="" add={add}
                           editorToggle={true} removeFromGrid={remove} />);
    });

    it('Word calls addWordToSpeechBar function when the word text is clicked', () => {
        word.find('.WordText').simulate('click');
        expect(add).toBeCalled();
    });

    it('Word calls removeFromGrid callback when the DeleteButton is clicked', () => {
        word.find('.DeleteButton').simulate('click');
        expect(remove).toBeCalled();
    });
});
