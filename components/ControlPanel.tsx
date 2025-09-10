import React from 'react';
import { ArchitecturalStyle } from '../types';
import { ARCHITECTURAL_STYLES } from '../constants';
import ImageUploader from './ImageUploader';
import StyleSelector from './StyleSelector';
import PromptInput from './PromptInput';

interface ControlPanelProps {
    onFileSelect: (file: File) => void;
    imagePreview: string | null;
    imageName: string | null;
    style: ArchitecturalStyle;
    onStyleChange: (style: ArchitecturalStyle) => void;
    materials: string;
    onMaterialsChange: (value: string) => void;
    lighting: string;
    onLightingChange: (value: string) => void;
    environment: string;
    onEnvironmentChange: (value: string) => void;
    onGenerate: () => void;
    isLoading: boolean;
    hasImage: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    onFileSelect,
    imagePreview,
    imageName,
    style,
    onStyleChange,
    materials,
    onMaterialsChange,
    lighting,
    onLightingChange,
    environment,
    onEnvironmentChange,
    onGenerate,
    isLoading,
    hasImage,
}) => {
    const isFormIncomplete = !hasImage || !style || !materials || !lighting || !environment;

    return (
        <div className="bg-black p-6 rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-800 h-full">
            <h2 className="text-2xl font-semibold text-white border-b border-gray-800 pb-3">1. Upload & Configure</h2>
            <ImageUploader onFileSelect={onFileSelect} preview={imagePreview} fileName={imageName} />
            <StyleSelector selectedStyle={style} onStyleSelect={onStyleChange} styles={ARCHITECTURAL_STYLES} />
            
            <h2 className="text-2xl font-semibold text-white border-b border-gray-800 pb-3 mt-4">2. Describe Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PromptInput
                    label="Materials"
                    value={materials}
                    onChange={(e) => onMaterialsChange(e.target.value)}
                    placeholder="e.g., Concrete floors, oak wood..."
                />
                <PromptInput
                    label="Lighting"
                    value={lighting}
                    onChange={(e) => onLightingChange(e.target.value)}
                    placeholder="e.g., Warm afternoon sun..."
                />
            </div>
            <PromptInput
                label="Environment / View"
                value={environment}
                onChange={(e) => onEnvironmentChange(e.target.value)}
                placeholder="e.g., A view of snowy mountains..."
            />

            <button
                onClick={onGenerate}
                disabled={isLoading || isFormIncomplete}
                className="w-full mt-auto py-3 px-6 text-lg font-bold text-black bg-white rounded-lg hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg"
            >
                {isLoading ? 'Visualizing...' : 'Visualize Plan'}
            </button>
        </div>
    );
};