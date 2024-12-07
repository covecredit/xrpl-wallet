import { NetworkConfig } from '../types/network';
import { ThemeName } from '../types/theme';
import { Widget } from '../types/widget';

export interface StorageData {
  theme: ThemeName;
  network: NetworkConfig | null;
  seed: string | null;
  widgets: Widget[];
}