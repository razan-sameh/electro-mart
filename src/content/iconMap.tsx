// iconMap.ts
import {
  PiMonitorThin,
  PiDeviceMobileThin,
  PiGameControllerThin,
  PiDeviceTabletCameraThin,
  PiHeadphonesLight,
  PiCameraThin,
  PiWatchThin,
  PiSpeakerHifiThin,
  PiTelevisionSimpleThin,
  PiHouseLineThin,
} from "react-icons/pi";
import { CiDesktopMouse2 } from "react-icons/ci";
import { ComponentType } from "react";

// ✅ Store component types instead of JSX elements
export const iconMap: Record<string, ComponentType<{ fontSize?: number }>> = {
  PiMonitorThin,
  PiDeviceMobileThin,
  PiGameControllerThin,
  PiDeviceTabletCameraThin,
  PiHeadphonesLight,
  CiDesktopMouse2,
  PiCameraThin,
  PiWatchThin,
  PiSpeakerHifiThin,
  PiTelevisionSimpleThin,
  PiHouseLineThin,
};

// ✅ Helper function to render icons
export const renderIcon = (iconName: string, size: number = 20) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) return null;
  return <IconComponent fontSize={size} />;
};