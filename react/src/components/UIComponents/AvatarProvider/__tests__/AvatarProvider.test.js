import React from 'react';
import {shallow} from 'enzyme';
import {describe, it, expect} from '@jest/globals';
import AvatarProvider from '../AvatarProvider';

describe('AvatarProvider', () => {
    let wrapper;

    it('should be rendered', () => {
        wrapper = shallow(<AvatarProvider/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('shows the correct text in the bar for provider', () => {
        wrapper = shallow(<AvatarProvider/>);
        const text = wrapper.find('div div span').text();
        expect(text).toEqual('Provider');
    });
});
