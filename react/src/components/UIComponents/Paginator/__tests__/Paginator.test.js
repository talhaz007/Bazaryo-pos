import React from 'react';
import {shallow} from 'enzyme';
import {describe, it, expect} from '@jest/globals';
import Paginator from '../Paginator';

describe('Paginator', () => {
    let wrapper;

    it('should be rendered', () => {
        wrapper = shallow(<Paginator/>);
        expect(wrapper).toMatchSnapshot();
    });
});
