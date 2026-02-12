
export interface Star {
  name: string;
  brightness?: string;
  siHua?: string;
  transformation?: 'Lu' | 'Quan' | 'Ke' | 'Ji' | string;
  direction?: 'In' | 'Out' | string;
}

export interface PalaceData {
  name: string;
  ganZhi: string;
  mainStars: Star[];
  assistStars: Star[];
  minorStars: Star[];
  shenSha: string[];
  daXian: string;
  xiaoXian: string;
  liuNian: string;
}

export interface ChartData {
  basicInfo: {
    gender: string;
    birthTime: string;
    lunarTime: string;
    baZi: string;
    fiveElements: string;
    shenZhu: string;
    mingZhu: string;
  };
  palaces: PalaceData[];
}
