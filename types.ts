
export enum RoastStyle {
  MODERN = 'Modern Slang',
  SHAKESPEAREAN = 'Shakespearean',
  ACADEMIC = 'Overly Academic',
  PASSIVE_AGGRESSIVE = 'Passive Aggressive',
  VIKING = 'Viking Skald',
  GEN_Z = 'Gen Z / Brainrot'
}

export enum RoastFocus {
  INTELLIGENCE = 'Intelligence',
  FASHION = 'Fashion Sense',
  LIFE_CHOICES = 'Life Choices',
  SKILLS = 'General Competence',
  GAMING = 'Gaming Ability',
  LOOKS = 'Physical Appearance'
}

export interface RoastSettings {
  targetName: string;
  context: string;
  savageLevel: number; // 0 to 100
  wittyLevel: number;  // 0 to 100
  absurdityLevel: number; // 0 to 100
  style: RoastStyle;
  focus: RoastFocus;
  image?: string; // base64 string
}

export interface GeneratedRoast {
  id: string;
  text: string;
  timestamp: number;
  settings: RoastSettings;
  caricatureUrl?: string;
  stats: {
    wit: number;
    heat: number;
    chaos: number;
  };
}
