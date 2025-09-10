import React from 'react';

interface PromptInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
}

const PromptInput: React.FC<PromptInputProps> = ({ label, value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={label} className="text-lg font-medium text-gray-300">
        {label}
      </label>
      <textarea
        id={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200 resize-none"
      />
    </div>
  );
};

export default PromptInput;