import React from 'react';

const Checkbox = ({ isSelected, onChange }) => {
    return (
        <div className="alignCenter">
            <label className="pointer alignCenter grid--check--box">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onChange}
                    className="input-check--mark"
                    role="checkbox"
                    tabIndex={0}
                />
                <span
                    className="check--mark"
                />
            </label>
        </div>
    );
};

export default Checkbox;