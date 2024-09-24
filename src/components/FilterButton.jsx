import React, { useState } from 'react';

const FilterButton = ({ filters, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (filterType) => {
    onChange({ ...filters, [filterType]: !filters[filterType] });
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-secondary"
      >
        Filter
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {Object.entries(filters).map(([filterType, isChecked]) => (
              <div key={filterType} className="px-4 py-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(filterType)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-2">{filterType === 'exclude_warmups' ? 'Exclude warmups' : filterType}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton;