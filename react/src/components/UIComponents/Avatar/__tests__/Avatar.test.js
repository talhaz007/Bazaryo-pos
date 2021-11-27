import React from 'react';
import {shallow} from 'enzyme';
import {
    describe, it, jest, expect
} from '@jest/globals';
import Avatar from '../Avatar';

jest.mock('react-i18next', () => ({
    useTranslation: () => ({t: (key) => key})
}));

describe('Avatar', () => {
    let wrapper;

    it('should be rendered', () => {
        wrapper = shallow(<Avatar/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('should render an Avatar with image src: http://example.com/image', () => {
        wrapper = shallow(<Avatar userImage="http://example.com/image"/>);
        expect(wrapper.find('img').props().src).toEqual('http://example.com/image');
    });

    it('should render an Avatar with alt attr: Dirk', () => {
        wrapper = shallow(<Avatar userName="Dirk"/>);
        expect(wrapper.find('img').props().alt).toEqual('Dirk');
    });

    it('should render an Avatar in size of medium', () => {
        wrapper = shallow(<Avatar size="medium"/>);
        expect(wrapper.find('.medium')).toHaveLength(1);
    });

    it('should render an Avatar with class name: costumeClassName', () => {
        wrapper = shallow(<Avatar className="costumeClassName"/>);
        expect(wrapper.find('.costumeClassName')).toHaveLength(1);
    });
});
