import React from 'react';
import '../Style/filter.css';

const FilterSelect = ({ filters, onFilterChange }) => {
  const [selectedValues, setSelectedValues] = React.useState({});

  const handleChange = (name, value) => {
    const newValues = { ...selectedValues, [name]: value };
    setSelectedValues(newValues);
    onFilterChange(newValues);
  };

  return (
    <div className="filter-container">
      {filters.map((filter) => (
        <div key={filter.name} className="filter-select">
          <label>{filter.label}</label>
          <select
            value={selectedValues[filter.name] || ''}
            onChange={(e) => handleChange(filter.name, e.target.value)}
          >
            <option value="">All</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default FilterSelect;
