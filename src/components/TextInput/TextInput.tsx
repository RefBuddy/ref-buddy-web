import React, { useMemo } from 'react';
import cn from 'classnames';
import cuid from 'cuid';

export interface TextInputProps {
  className?: string;
  error?: string;
  icon?: any;
  label?: string;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  handleKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  setValue: (value: string) => void;
  value: string;
  type?: string;
}
const TextInput: React.FC<TextInputProps> = ({
  className,
  error,
  icon,
  label,
  maxLength,
  placeholder,
  required,
  setValue,
  handleKeyDown = () => {},
  value,
  ...props
}: TextInputProps) => {
  const inputId = useMemo<string>(() => `TextInput-${cuid()}`, []);

  return (
    <label
      htmlFor={inputId}
      data-testid="TextInput"
      className={cn(
        {
          'mt-2': !!label,
        },
        className,
      )}
    >
      <div
        className={cn(
          'relative flex items-center gap-1 pb-2 px-3 transition-all border rounded shadow-black focus-within:shadow',
          {
            'border-gray-400 text-gray-400 focus-within:text-black focus-within:border-black':
              !error,
            'border-error-700 text-error-700': error,
            'pt-3': label,
            'pt-2': !label,
          },
        )}
      >
        {label && (
          <span
            className={cn(
              'absolute px-1 text-xs font-normal bg-white left-2 font-body -top-2',
            )}
            data-testid="TextInput__label"
          >
            {label}
            {required && ' *'}
          </span>
        )}

        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          className="flex-1 text-sm outline-none text-gray-1100"
          onChange={(event) => {
            setValue(event.target.value);
          }}
          value={value}
          onKeyDown={(event) => {
            handleKeyDown(event);
          }}
          maxLength={maxLength}
          data-testid="TextInput__input"
          required={required}
          {...props}
        />

        {icon}
      </div>

      {error && (
        <p className="mt-1 text-xs text-right text-error-700">{error}</p>
      )}
    </label>
  );
};

export default TextInput;
