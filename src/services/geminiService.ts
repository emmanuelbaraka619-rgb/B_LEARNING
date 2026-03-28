import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SummaryResult {
  summary: string;
  flashcards: { front: string; back: string }[];
  quiz: { question: string; options: string[]; answer: string }[];
}

export interface GenerateInput {
  text?: string;
  file?: {
    data: string;
    mimeType: string;
  };
}

export const generateLearningMaterials = async (input: GenerateInput): Promise<SummaryResult> => {
  try {
    const parts: any[] = [];
    
    if (input.file) {
      parts.push({
        inlineData: {
          data: input.file.data,
          mimeType: input.file.mimeType,
        },
      });
    }
    
    parts.push({
      text: `You are an expert educator. Based on the following notes/document, generate a professional summary, 10 flashcards, and a 20-question multiple-choice quiz.
      
Notes:
${input.text || ''}
`
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional summary of the notes with bullet points and bolded key terms in Markdown format.",
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING, description: "The question or term on the front of the flashcard." },
                  back: { type: Type.STRING, description: "The answer or definition on the back of the flashcard." },
                },
                required: ["front", "back"],
              },
              description: "A list of 10 flashcards based on the notes.",
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING, description: "The multiple-choice question." },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "An array of 4 possible options.",
                  },
                  answer: { type: Type.STRING, description: "The correct option (must exactly match one of the options)." },
                },
                required: ["question", "options", "answer"],
              },
              description: "A 20-question multiple-choice quiz based on the notes.",
            },
          },
          required: ["summary", "flashcards", "quiz"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as SummaryResult;
  } catch (error) {
    console.error("Error generating learning materials:", error);
    throw error;
  }
};

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const askChatbot = async (
  context: string,
  history: ChatMessage[],
  message: string
): Promise<string> => {
  try {
    const contents = [...history, { role: 'user', parts: [{ text: message }] }];
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: `You are an AI tutor. Answer the user's questions based on the following notes/context:\n\n${context}\n\nIf the answer is not in the notes, use your general knowledge but mention that it's not explicitly in the notes. Keep your answers concise and helpful.`,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return text;
  } catch (error) {
    console.error("Error in chatbot:", error);
    throw error;
  }
};
