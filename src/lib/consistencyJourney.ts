/**
 * PANDUR — Consistency Journey Configuration
 * 
 * Defines the progress stages and static data for the "From Oven to Shelf" scroll section.
 * Replaces the static Craft section with an interactive cookie storyline.
 */

export const CONSISTENCY_STAGES = {
  OVEN: { start: 0.0, end: 0.20 },
  CLONES: { start: 0.25, end: 0.45 },
  QUALITY: { start: 0.50, end: 0.75 },
  SHELF: { start: 0.80, end: 1.0 },
};

export const OVEN_TIMELINE = [
  { progress: 0.03, value: "10" },
  { progress: 0.06, value: "20" },
  { progress: 0.09, value: "30" },
  { progress: 0.12, value: "45" },
];

export const QUALITY_CHECKPOINTS = [
  { id: "mix", label: "MIX", p: 0.51 },
  { id: "bake", label: "BAKE", p: 0.53 },
  { id: "cool", label: "COOL", p: 0.55 },
  { id: "check", label: "CHECK", p: 0.57 },
  { id: "pack", label: "PACK", p: 0.59 },
];

export const DESTINATIONS = [
  { name: "ABU DHABI", angle: -90, radius: 140 },
  { name: "DUBAI", angle: -39, radius: 150 },
  { name: "SHARJAH", angle: 13, radius: 160 },
  { name: "AJMAN", angle: 64, radius: 140 },
  { name: "UMM AL QUWAIN", angle: 116, radius: 150 },
  { name: "RAS AL KHAIMAH", angle: 167, radius: 160 },
  { name: "FUJAIRAH", angle: 219, radius: 150 },
];

export const SHELF_TIMELINE = [
  { progress: 0.82, label: "DAY 01", angle: 180 }, // Left
  { progress: 0.84, label: "MONTH 01", angle: 240 }, // Top-Left
  { progress: 0.86, label: "MONTH 03", angle: 300 }, // Top-Right
  { progress: 0.88, label: "MONTH 06", angle: 0 }, // Right
];
