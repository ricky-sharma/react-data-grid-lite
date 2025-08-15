import React from 'react';

const Checkbox = ({ isSelected, onChange }) => {
    return (
        <div className="alignCenter">
            <label className="pointer alignCenter grid--check--box">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onChange}
                />
                <span className="checkmark" />
            </label>
        </div>
    );
};

export default Checkbox;