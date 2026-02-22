export interface DogeIndex {
  id: number;
  inscriptionNumber: number;
  score: number;
  rank: number;
  bg: string;
  fur: string;
  eyes: string;
  mouth: string;
  head: string;
  body: string;
  mouthAcc: string;
}

export interface DogeDetail {
  id: number;
  inscriptionId: string;
  inscriptionNumber: number;
  attributes: Record<string, string>;
}

export interface TraitCategory {
  name: string;
  key: string;
  values: { value: string; count: number }[];
}
