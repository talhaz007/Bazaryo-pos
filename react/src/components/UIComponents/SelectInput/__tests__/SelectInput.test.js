import React from 'react';
import {mount} from 'enzyme';
import {
    describe, it, expect
} from '@jest/globals';
import {I18nextProvider} from 'react-i18next';
import {act} from 'react-dom/test-utils';
import i18n from '../../../../../i18nextForTests';
import SelectInput from '../SelectInput';

describe('SelectInput Component', () => {
    it('should render without error', () => {
        const selectComponent = mount(
            <I18nextProvider i18n={i18n}>
                <SelectInput
                    className="select-class"
                    options={['Germany', 'USA']}
                    value="de"
                    placeholder="Select Input"
                    disabled
                />
            </I18nextProvider>
        );
        expect(selectComponent).toMatchSnapshot();
    });

    it('should call click function', async () => {
        const selectComponent = mount(
            <I18nextProvider i18n={i18n}>
                <SelectInput
                    className="select-class"
                    options={['Germany', 'USA']}
                    value="USA"
                    placeholder="Select Input"
                />
            </I18nextProvider>
        );
        const selectorWrapper = selectComponent.find('.selector-wrapper');
        act(() => {
            selectorWrapper.prop('onClick')();
            expect(selectorWrapper.prop('onClick')).toBeInstanceOf(Function);
            const select = selectComponent.find('.select').first();
            expect(select.prop('onClick')).toBeInstanceOf(Function);
        });
    });
});
