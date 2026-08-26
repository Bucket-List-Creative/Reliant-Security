import {
  IconShieldCheck,
  IconDeviceMobile,
  IconHeartbeat,
  IconTool,
  IconDeviceCctv,
  IconWifi,
  IconSmartHome,
  IconKey,
  IconNetwork,
  IconDeviceSpeaker,
  IconShieldLock,
  IconServer,
  IconLayoutGrid,
  IconBuildingSkyscraper,
  IconBuildingFactory2,
  IconBuildingBank,
  IconUsersGroup,
  IconBriefcase,
  IconBook2,
  IconHomeStar,
  IconBuildingCommunity,
  IconBuildingStore,
  IconBuildingWarehouse,
  IconBuildingHospital,
  IconBuildingEstate,
  IconSearch,
  type Icon,
  type IconProps,
} from "@tabler/icons-react";

/**
 * Service / category glyphs, drawn from Tabler Icons (MIT-licensed, free for
 * commercial use — https://tabler.io/icons). Rendered at stroke width 1.75 with
 * `currentColor` to sit inside the neumorphic icon wells.
 *
 * Keys map to `iconKey` values on the taxonomy (`src/content/services.ts`) and,
 * once editors set them, on Sanity `service` documents.
 */
export type ServiceIconKey =
  | "shield-check"
  | "smartphone"
  | "heart-pulse"
  | "wrench"
  | "cctv"
  | "wifi"
  | "home"
  | "key"
  | "network"
  | "speaker"
  | "cyber"
  | "server"
  | "grid"
  | "building"
  | "factory"
  | "government"
  | "team"
  | "projects"
  | "resources"
  | "custom-home"
  | "multi-family"
  | "store"
  | "warehouse"
  | "healthcare"
  | "property"
  | "search";

const ICONS: Record<ServiceIconKey, Icon> = {
  "shield-check": IconShieldCheck,
  smartphone: IconDeviceMobile,
  "heart-pulse": IconHeartbeat,
  wrench: IconTool,
  cctv: IconDeviceCctv,
  wifi: IconWifi,
  home: IconSmartHome,
  key: IconKey,
  network: IconNetwork,
  speaker: IconDeviceSpeaker,
  cyber: IconShieldLock,
  server: IconServer,
  grid: IconLayoutGrid,
  building: IconBuildingSkyscraper,
  factory: IconBuildingFactory2,
  government: IconBuildingBank,
  team: IconUsersGroup,
  projects: IconBriefcase,
  resources: IconBook2,
  "custom-home": IconHomeStar,
  "multi-family": IconBuildingCommunity,
  store: IconBuildingStore,
  warehouse: IconBuildingWarehouse,
  healthcare: IconBuildingHospital,
  property: IconBuildingEstate,
  search: IconSearch,
};

export function isServiceIconKey(v: unknown): v is ServiceIconKey {
  return typeof v === "string" && v in ICONS;
}

type Props = IconProps & {
  name: ServiceIconKey;
  /** Pixel size for width & height. Defaults to 24. */
  size?: number;
};

export function ServiceIcon({ name, size = 24, stroke = 1.75, ...rest }: Props) {
  const Cmp = ICONS[name] ?? IconShieldCheck;
  return <Cmp size={size} stroke={stroke} aria-hidden {...rest} />;
}
