import React from 'react';
import { SpinnerIcon, ImageIcon, ErrorIcon, VideoIcon } from './Icons';

interface ResultDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
  uploadedImage: string | null;
  error: string | null;
  isGeneratingVideo: boolean;
  generatedVideoUrl: string | null;
  onGenerateTour: () => void;
}

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-white">
    <SpinnerIcon />
    <p className="text-lg font-semibold animate-pulse">AI is visualizing your plan...</p>
    <p className="text-sm text-gray-400 text-center">This may take a moment. High-quality rendering in progress.</p>
  </div>
);

const InitialState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-500">
    <ImageIcon />
    <p className="text-lg font-semibold">Your visualization will appear here</p>
    <p className="text-sm text-center">Upload a plan and configure the details to get started.</p>
  </div>
);

const UploadedPreviewState: React.FC<{ image: string }> = ({ image }) => (
    <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-lg font-semibold text-gray-400 mb-4">Plan Preview</p>
        <img
          src={image}
          alt="Uploaded architectural plan"
          className="object-contain w-full h-full max-h-[calc(60vh-3rem)] rounded-lg shadow-lg"
        />
    </div>
);

const ErrorState: React.FC<{ error: string }> = ({ error }) => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-white bg-black p-4 rounded-lg border border-gray-600">
    <ErrorIcon />
    <p className="text-lg font-semibold text-center">An Error Occurred</p>
    <p className="text-sm text-gray-300 text-center">{error}</p>
  </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
    isLoading, 
    generatedImage, 
    uploadedImage, 
    error,
    isGeneratingVideo,
    generatedVideoUrl,
    onGenerateTour
}) => {

  const renderVideoSection = () => {
    if (error && !isGeneratingVideo) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-2 text-white bg-black p-4 rounded-lg border border-gray-600">
          <ErrorIcon />
          <p className="text-md font-semibold text-center">Video Generation Failed</p>
          <p className="text-sm text-gray-300 text-center max-w-md">{error}</p>
        </div>
      );
    }

    if (isGeneratingVideo) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4 text-white bg-black rounded-lg p-4">
          <SpinnerIcon />
          <p className="text-lg font-semibold animate-pulse">Creating your virtual tour...</p>
          <p className="text-sm text-gray-400 text-center">This can take a few minutes. The AI is building the video.</p>
        </div>
      );
    }

    if (generatedVideoUrl) {
      return (
        <video controls autoPlay loop className="object-contain w-full rounded-lg shadow-2xl">
          <source src={generatedVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] bg-black border border-gray-800 rounded-lg p-4">
        <p className="text-gray-400 text-center mb-4">Generate a walkthrough video from your visualization.</p>
        <button
          onClick={onGenerateTour}
          disabled={isGeneratingVideo}
          className="py-2 px-5 text-base font-semibold text-black bg-white rounded-lg hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 shadow-lg flex items-center gap-2"
        >
          <VideoIcon />
          Create Virtual Tour
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error && !generatedImage) {
      return <ErrorState error={error} />;
    }
    if (generatedImage) {
      return (
        <div className="w-full h-full overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-3 text-center">Visualization</h3>
              <img
                src={generatedImage}
                alt="Generated architectural visualization"
                className="object-contain w-full mx-auto max-h-[50vh] rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-300 mb-3 text-center">Virtual Tour</h3>
              <div className="max-w-xl mx-auto">
                {renderVideoSection()}
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (uploadedImage) {
        return <UploadedPreviewState image={uploadedImage} />;
    }
    return <InitialState />;
  };
    
  return (
    <div className="bg-black p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col h-full">
        <h2 className="text-2xl font-semibold text-white border-b border-gray-800 pb-3 mb-6">3. Result</h2>
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-black rounded-lg p-4">
            {renderContent()}
        </div>
    </div>
  );
};

export default ResultDisplay;