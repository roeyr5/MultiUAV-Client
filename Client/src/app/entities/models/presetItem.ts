import { TelemetryGridsterItem } from "./chartitem"

export interface PresetItem {
  presetName : string;
  parameters : TelemetryGridsterItem[];
}
export interface createPresetDto {
  email:string;
  presetItem: PresetItem;
}
