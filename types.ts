
export enum ArchitecturalStyle {
  MidCenturyModern = 'Mid-Century Modern',
  Modern = 'Modern',
  Minimalist = 'Minimalist',
  Industrial = 'Industrial',
  Scandinavian = 'Scandinavian',
  Bohemian = 'Bohemian',
  Coastal = 'Coastal',
  Farmhouse = 'Farmhouse',
  Neoclassical = 'Neoclassical',
}

export type ImageFile = {
  base64: string;
  mimeType: string;
  name: string;
};
