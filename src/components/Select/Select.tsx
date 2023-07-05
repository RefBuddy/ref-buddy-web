/* eslint-disable react/no-unknown-property */
import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const Select = ({ field, value, onChange }) => (
  <div>
    <label className="block text-xs mb-2 font-medium text-gray-500" htmlFor={field.key}>
      {`${field.label}${field.required ? ' *' : ''}`}
    </label>
    <div className="relative">
      <select
        data-testid={field.key}
        name={field.key}
        id={field.key}
        className="w-full p-2 pr-8 transition-colors duration-150 border-2 rounded appearance-none resize-none bg-cleverWhite text-cleverDark300 focus:outline-none focus:border-secondary-500"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option disabled selected hidden>
          -- Select an option --
        </option>
        {field.options.map((option: any) => (
          <option key={option} value={option} data-testid={`${field.key}-${option}`}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDownIcon className="absolute w-5 transform -translate-y-1/2 right-2 top-1/2 text-secondary-500" />
    </div>
  </div>
);

export default Select;
