import { GoogleGenAI, Modality } from "@google/genai";
import { ArchitecturalStyle, ImageFile } from '../types';

type ImageData = {
  base64: string;
  mimeType: string;
};

export const visualizePlan = async (
  planImage: ImageFile,
  style: ArchitecturalStyle,
  materials: string,
  lighting: string,
  environment: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = {
    inlineData: { data: planImage.base64.split(',')[1], mimeType: planImage.mimeType },
  };

  const textPrompt = `
    Your primary and most critical instruction is to create a photorealistic 3D rendering that is an exact, to-the-millimeter replica of the provided architectural floor plan. The structural integrity of the plan is non-negotiable.

    **Mandatory Rules:**
    1.  **Strict Adherence to Plan:** The layout, room dimensions, wall placements, and the exact positions of doors, windows, and any other structural features must be reproduced with absolute precision.
    2.  **No Structural Alterations:** You MUST NOT add, remove, resize, or reposition any walls, doors, windows, or structural elements shown in the plan.
    3.  **Style vs. Structure:** The selected architectural style ('${style}') must ONLY influence the choice of furniture, color schemes, materials, and decorative objects. It MUST NOT, under any circumstances, influence the building's structure, layout, or dimensions as defined by the provided plan. Your interpretation of the style must be confined entirely within the existing architectural boundaries.
    4.  **Perspective:** The final image must be a top-down, bird's-eye view of the entire interior layout.

    **Stylistic Direction (Secondary to Structural Accuracy):**
    -   **Interior Design Style:** Apply a '${style}' aesthetic to the furnishings, color palette, and decor, strictly following Rule #3.
    -   **Materials:** Feature these materials prominently: '${materials}'.
    -   **Lighting:** The scene should be illuminated with '${lighting}'.
    -   **Exterior View:** The environment visible through windows should be a '${environment}'.

    The final output must be a clean image without any text, labels, or watermarks. Your success on this task is measured first and foremost by your accuracy in replicating the floor plan's structure.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: [
                imagePart,
                { text: textPrompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error("The AI did not return an image. Please try adjusting your prompts.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate visualization. Please check your inputs and try again.");
  }
};

export const createVirtualTour = async (
  generatedImage: ImageData,
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = "Create a captivating virtual tour video from a first-person perspective, as if we are seeing through the eyes of a person. The tour must begin with the person entering the house from the main entrance. The camera should move smoothly at eye-level, guiding the viewer through every room and space shown in the plan, lingering on key design elements. The movement should feel natural, like someone exploring a new home for the first time. Finally, the tour should conclude with the person walking out and leaving the house. The entire video should be immersive and provide a complete walkthrough experience.";

  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      image: {
        imageBytes: generatedImage.base64,
        mimeType: generatedImage.mimeType,
      },
      config: { numberOfVideos: 1 }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was provided.");
    }
    
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        throw new Error(`Failed to download the generated video. Status: ${videoResponse.statusText}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);

  } catch (error) {
    console.error("Error calling Gemini Video API:", error);
    throw new Error("Failed to generate virtual tour. The model might be busy, please try again later.");
  }
};