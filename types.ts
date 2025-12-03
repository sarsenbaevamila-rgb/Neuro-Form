export enum View {
  STRATEGY = 'STRATEGY',
  MARKET = 'MARKET',
  VISUALS = 'VISUALS',
  AUDIO = 'AUDIO',
  LIVE = 'LIVE'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}