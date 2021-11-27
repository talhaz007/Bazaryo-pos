import React from 'react';

import './Selector.scss';

const Selector = (props) => {
    const {
        name, label, htmlFor, required, value, options, onChange, error, className
    } = props;
    const selectorOptions = [];
    if (options) {
        Object.keys(options).forEach((key) => {
            selectorOptions.push(
                <option key={key} value={options[key].id}>{`${options[key].value}`}</option>
            );
        });
    } else {
        return false;
    }
    return (
        <div className={['selector-wrapper', className, error ? 'error' : ''].join(' ')}>
            <label htmlFor={htmlFor} className={[`${label}-label`, required ? 'required' : ''].join(' ')}>
                {label || ''}
            </label>
            <select
                id={label}
                title={label}
                name={name}
                className={`selector${error ? ' error' : ''}`}
                onChange={onChange}
                value={value}
                required
            >
                {selectorOptions}
            </select>
            <div className="error-message">{error}</div>
        </div>
    );
};

export default Selector;