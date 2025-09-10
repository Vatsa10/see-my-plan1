import React from 'react';
import { ArchitecturalStyle } from '../types';

interface StyleSelectorProps {
  selectedStyle: ArchitecturalStyle;
  onStyleSelect: (style: ArchitecturalStyle) => void;
  styles: ArchitecturalStyle[];
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleSelect, styles }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-300 mb-3">Architectural Style</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => onStyleSelect(style)}
            className={`px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white ${
              selectedStyle === style
                ? 'bg-white text-black shadow-md'
                : 'bg-black text-white border border-gray-700 hover:bg-gray-800'
            }`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;