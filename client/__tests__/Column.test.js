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
import { shallow } from 'enzyme';
import Column from '../src/components/Column';
import speechSynthesis from '../src/mocks';

it('Column component shallow renders without crashing', () => {
    let add = jest.fn();
    shallow(<Column add={add}/>);
});
