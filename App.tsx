import React, { useState, useCallback } from 'react';
import { ArchitecturalStyle, ImageFile } from './types';
import { visualizePlan, createVirtualTour } from './services/geminiService';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [style, setStyle] = useState<ArchitecturalStyle>(ArchitecturalStyle.Modern);
  const [materials, setMaterials] = useState<string>('Oak wood floors, white marble countertops, and brushed brass fixtures.');
  const [lighting, setLighting] = useState<string>('Warm, soft afternoon light streaming through large floor-to-ceiling windows.');
  const [environment, setEnvironment] = useState<string>('A serene view of a lush green forest with a gentle mist.');
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
  
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        setImageFile({
            base64: reader.result as string,
            mimeType: file.type,
            name: file.name,
        });
        setGeneratedImage(null);
        setGeneratedVideoUrl(null);
        setError(null);
    };
    reader.onerror = () => {
        setError("Failed to read the file.");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!imageFile) {
      setError('Please upload an architectural plan first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setGeneratedVideoUrl(null);

    try {
      const result = await visualizePlan(imageFile, style, materials, lighting, environment);
      setGeneratedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, style, materials, lighting, environment]);

  const handleGenerateTour = useCallback(async () => {
    if (!generatedImage) {
      setError('A visualized plan is required to create a tour.');
      return;
    }

    setIsGeneratingVideo(true);
    setError(null);

    try {
      const matches = generatedImage.match(/^data:(.+);base64,(.*)$/);
      if (!matches || matches.length !== 3) {
          throw new Error("Invalid image format for video generation.");
      }
      const mimeType = matches[1];
      const base64 = matches[2];
      
      const tourUrl = await createVirtualTour({ base64, mimeType });
      setGeneratedVideoUrl(tourUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during video generation.');
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [generatedImage]);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 xl:col-span-4">
                <ControlPanel
                    onFileSelect={handleFileSelect}
                    imagePreview={imageFile?.base64 || null}
                    imageName={imageFile?.name || null}
                    style={style}
                    onStyleChange={setStyle}
                    materials={materials}
                    onMaterialsChange={setMaterials}
                    lighting={lighting}
                    onLightingChange={setLighting}
                    environment={environment}
                    onEnvironmentChange={setEnvironment}
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                    hasImage={!!imageFile}
                />
            </div>
            <div className="lg:col-span-7 xl:col-span-8">
                <ResultDisplay
                    isLoading={isLoading}
                    generatedImage={generatedImage}
                    uploadedImage={imageFile?.base64 || null}
                    error={error}
                    isGeneratingVideo={isGeneratingVideo}
                    generatedVideoUrl={generatedVideoUrl}
                    onGenerateTour={handleGenerateTour}
                />
            </div>
        </main>
      </div>
    </div>
  );
}

export default App;