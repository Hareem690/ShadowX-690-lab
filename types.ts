
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Video } from '@google/genai';

export enum AppState {
  IDLE,
  ANALYZING,
  CRACKING,
  FINISHED,
  ERROR,
}

export enum HardwareTier {
  LAPTOP = 'Laptop (Integrated)',
  DESKTOP = 'Gaming PC (CPU)',
  RTX_4090 = 'RTX 4090 (Single)',
  RTX_CLUSTER = 'RTX 4090 Cluster (8x)',
  SUPERCOMPUTER = 'Nvidia DGX SuperPOD',
  QUANTUM = 'Quantum Processor (Simulated)',
  CUSTOM = 'Custom Device Selection'
}

export interface DeviceSpec {
  name: string;
  hashesPerSecond: number;
  category: 'Mobile' | 'Laptop' | 'Desktop' | 'GPU' | 'Server' | 'Exotic';
}

export const DeviceDatabase: DeviceSpec[] = [
  // --- Laptops ---
  { name: 'Razer Blade 16 (RTX 4090 Mobile)', hashesPerSecond: 110_000_000_000, category: 'Laptop' },
  { name: 'ASUS ROG Zephyrus G14 (RTX 4070 Mobile)', hashesPerSecond: 50_000_000_000, category: 'Laptop' },
  { name: 'Acer Nitro 5 (RTX 4050 Mobile)', hashesPerSecond: 25_000_000_000, category: 'Laptop' },
  { name: 'Apple MacBook Pro 14-inch (M3 Pro)', hashesPerSecond: 14_000_000_000, category: 'Laptop' },
  { name: 'Apple MacBook Air 13-inch (M3 Chip)', hashesPerSecond: 6_000_000_000, category: 'Laptop' },
  { name: 'Apple MacBook Air 15-inch (M3 Chip)', hashesPerSecond: 6_000_000_000, category: 'Laptop' },
  { name: 'Dell XPS 13 (Integrated Intel Arc)', hashesPerSecond: 1_500_000_000, category: 'Laptop' },
  { name: 'ASUS ZenBook 14 OLED (Intel Arc)', hashesPerSecond: 1_500_000_000, category: 'Laptop' },
  { name: 'Samsung Galaxy Book4 Pro (Intel Arc)', hashesPerSecond: 1_500_000_000, category: 'Laptop' },
  { name: 'HP Spectre x360 14 (Intel Arc)', hashesPerSecond: 1_200_000_000, category: 'Laptop' },
  { name: 'Microsoft Surface Laptop 7', hashesPerSecond: 1_000_000_000, category: 'Laptop' },
  { name: 'Lenovo Yoga 9i (Intel Iris Xe)', hashesPerSecond: 900_000_000, category: 'Laptop' },
  { name: 'Lenovo ThinkPad X1 Carbon (Iris Xe)', hashesPerSecond: 800_000_000, category: 'Laptop' },
  { name: 'HP EliteBook 840 Series (Iris Xe)', hashesPerSecond: 800_000_000, category: 'Laptop' },
  { name: 'Dell Latitude 7400 Series (Iris Xe)', hashesPerSecond: 800_000_000, category: 'Laptop' },
  { name: 'LG Gram 16 (Integrated)', hashesPerSecond: 800_000_000, category: 'Laptop' },
  { name: 'HP Pavilion 15 (Integrated Graphics)', hashesPerSecond: 500_000_000, category: 'Laptop' },
  { name: 'Lenovo IdeaPad Slim 3', hashesPerSecond: 400_000_000, category: 'Laptop' },
  { name: 'Dell Inspiron 15 3000', hashesPerSecond: 400_000_000, category: 'Laptop' },
  { name: 'Acer Chromebook Spin 713', hashesPerSecond: 150_000_000, category: 'Laptop' },

  // --- Mobile ---
  { name: 'Samsung Galaxy S25 Ultra (SD Elite)', hashesPerSecond: 2_500_000_000, category: 'Mobile' },
  { name: 'Apple iPhone 16 Pro Max (A18 Pro)', hashesPerSecond: 2_100_000_000, category: 'Mobile' },
  { name: 'Apple iPhone 16 (A18)', hashesPerSecond: 1_900_000_000, category: 'Mobile' },
  { name: 'Samsung Galaxy S24 Ultra (SD 8 Gen 3)', hashesPerSecond: 1_800_000_000, category: 'Mobile' },
  { name: 'Samsung Galaxy Z Flip 6 (SD 8 Gen 3)', hashesPerSecond: 1_800_000_000, category: 'Mobile' },
  { name: 'OnePlus 12 (SD 8 Gen 3)', hashesPerSecond: 1_800_000_000, category: 'Mobile' },
  { name: 'Samsung Galaxy S23 (SD 8 Gen 2)', hashesPerSecond: 1_400_000_000, category: 'Mobile' },
  { name: 'POCO X6 Pro (Dimensity 8300 Ultra)', hashesPerSecond: 1_300_000_000, category: 'Mobile' },
  { name: 'Apple iPhone 15 / 15 Plus (A16)', hashesPerSecond: 1_200_000_000, category: 'Mobile' },
  { name: 'Google Pixel 8a / 9a (Tensor G3/G4)', hashesPerSecond: 1_100_000_000, category: 'Mobile' },
  { name: 'Apple iPhone 14 (A15 Bionic)', hashesPerSecond: 1_000_000_000, category: 'Mobile' },
  { name: 'Apple iPhone 13 (A15 Bionic)', hashesPerSecond: 1_000_000_000, category: 'Mobile' },
  { name: 'Apple iPhone SE (3rd Gen) (A15)', hashesPerSecond: 1_000_000_000, category: 'Mobile' },
  { name: 'Xiaomi Redmi Note 13 Series (SD 7s Gen 2)', hashesPerSecond: 600_000_000, category: 'Mobile' },
  { name: 'Apple iPhone 11 (A13 Bionic)', hashesPerSecond: 600_000_000, category: 'Mobile' },
  { name: 'Samsung Galaxy A54 / A55 (Exynos)', hashesPerSecond: 500_000_000, category: 'Mobile' },
  { name: 'Samsung Galaxy A15 / A16 5G', hashesPerSecond: 250_000_000, category: 'Mobile' },
  { name: 'Motorola Moto G Power', hashesPerSecond: 150_000_000, category: 'Mobile' },
  { name: 'Xiaomi Redmi 13C (Helio G85)', hashesPerSecond: 80_000_000, category: 'Mobile' },
  { name: 'Tecno Spark 20 (MediaTek G85)', hashesPerSecond: 80_000_000, category: 'Mobile' },

  // --- Desktops ---
  { name: 'HP OMEN 45L (RTX 4090)', hashesPerSecond: 190_000_000_000, category: 'Desktop' },
  { name: 'Alienware Aurora R16 (RTX 4080 Super)', hashesPerSecond: 130_000_000_000, category: 'Desktop' },
  { name: 'Corsair Vengeance i7500 (RTX 4080)', hashesPerSecond: 125_000_000_000, category: 'Desktop' },
  { name: 'ASUS ROG Strix G16CH (RTX 4070 Ti)', hashesPerSecond: 95_000_000_000, category: 'Desktop' },
  { name: 'Dell XPS 8960 Desktop (RTX 4070)', hashesPerSecond: 85_000_000_000, category: 'Desktop' },
  { name: 'Apple Mac Studio (M2 Ultra - 76-core)', hashesPerSecond: 75_000_000_000, category: 'Desktop' },
  { name: 'Lenovo Legion Tower 5i (RTX 4060 Ti)', hashesPerSecond: 62_000_000_000, category: 'Desktop' },
  { name: 'HP Envy Desktop (RTX 4060)', hashesPerSecond: 55_000_000_000, category: 'Desktop' },
  { name: 'CyberPowerPC Gamer Xtreme (RTX 4060)', hashesPerSecond: 55_000_000_000, category: 'Desktop' },
  { name: 'MSI Aegis Series (RTX 4060)', hashesPerSecond: 55_000_000_000, category: 'Desktop' },
  { name: 'Apple Mac Mini (M2 Pro Chip)', hashesPerSecond: 12_000_000_000, category: 'Desktop' },
  { name: 'Apple iMac 24-inch (M3 Chip)', hashesPerSecond: 6_500_000_000, category: 'Desktop' },
  { name: 'HP Pavilion Desktop TP01', hashesPerSecond: 1_200_000_000, category: 'Desktop' },
  { name: 'Dell OptiPlex 7000 (Intel UHD 770)', hashesPerSecond: 800_000_000, category: 'Desktop' },
  { name: 'Lenovo ThinkCentre M70q Tiny', hashesPerSecond: 600_000_000, category: 'Desktop' },
  { name: 'HP ProDesk 400 Series', hashesPerSecond: 600_000_000, category: 'Desktop' },
  { name: 'Acer Aspire TC-1700 (Integrated)', hashesPerSecond: 500_000_000, category: 'Desktop' },
  { name: 'Dell Inspiron Desktop 3000', hashesPerSecond: 500_000_000, category: 'Desktop' },
  { name: 'Lenovo IdeaCentre AIO 3', hashesPerSecond: 400_000_000, category: 'Desktop' },
  { name: 'HP Chromebase AIO (Integrated)', hashesPerSecond: 80_000_000, category: 'Desktop' },

  // --- Exotic / Server ---
  { name: 'Nvidia DGX H100 System', hashesPerSecond: 2_500_000_000_000, category: 'Server' },
  { name: 'Frontier Supercomputer', hashesPerSecond: 100_000_000_000_000, category: 'Exotic' },
  { name: 'IBM Osprey (Quantum)', hashesPerSecond: 10_000_000_000_000_000, category: 'Exotic' },
];

export const HardwareSpecs: Record<HardwareTier, { hashesPerSecond: number; label: string }> = {
  [HardwareTier.LAPTOP]: { hashesPerSecond: 2_000_000_000, label: '2 GH/s' },
  [HardwareTier.DESKTOP]: { hashesPerSecond: 15_000_000_000, label: '15 GH/s' },
  [HardwareTier.RTX_4090]: { hashesPerSecond: 190_000_000_000, label: '190 GH/s' },
  [HardwareTier.RTX_CLUSTER]: { hashesPerSecond: 1_520_000_000_000, label: '1.52 TH/s' },
  [HardwareTier.SUPERCOMPUTER]: { hashesPerSecond: 100_000_000_000_000, label: '100 TH/s' },
  [HardwareTier.QUANTUM]: { hashesPerSecond: 10_000_000_000_000_000, label: '10 PH/s' },
  [HardwareTier.CUSTOM]: { hashesPerSecond: 0, label: 'Variable' },
};

export interface PasswordAnalysis {
  entropy: number;
  crackingTimeSeconds: number;
  vulnerabilities: string[];
  score: number; // 0 to 100
  aiAdvice?: string;
}

export interface CrackingStep {
  id: string;
  type: 'brute-force' | 'dictionary' | 'hybrid';
  progress: number;
  status: 'pending' | 'active' | 'success' | 'failed';
  currentAttempt: string;
}

export enum AspectRatio {
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
}

export enum Resolution {
  P720 = '720p',
  P1080 = '1080p',
}

export enum VeoModel {
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  VEO = 'veo-3.1-generate-preview',
}

export enum GenerationMode {
  TEXT_TO_VIDEO = 'Text-to-Video',
  FRAMES_TO_VIDEO = 'Frames-to-Video',
  REFERENCES_TO_VIDEO = 'References-to-Video',
  EXTEND_VIDEO = 'Extend Video',
}

export interface ImageFile {
  file: File;
  base64: string;
}

export interface VideoFile {
  file: File;
  base64: string;
}

export interface GenerateVideoParams {
  prompt: string;
  model: VeoModel;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  mode: GenerationMode;
  startFrame?: ImageFile | null;
  endFrame?: ImageFile | null;
  referenceImages?: ImageFile[];
  styleImage?: ImageFile | null;
  inputVideo?: VideoFile | null;
  inputVideoObject?: Video | null;
  isLooping?: boolean;
}
