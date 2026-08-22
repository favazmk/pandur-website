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
  { progress: 0.02, value: "05" },
  { progress: 0.05, value: "10" },
  { progress: 0.08, value: "20" },
  { progress: 0.11, value: "30" },
  { progress: 0.14, value: "40" },
  { progress: 0.17, value: "45" },
];

export const QUALITY_CHECKPOINTS = [
  { id: "mix", label: "MIX", p: 0.52 },
  { id: "bake", label: "BAKE", p: 0.56 },
  { id: "cool", label: "COOL", p: 0.60 },
  { id: "check", label: "CHECK", p: 0.64 },
  { id: "pack", label: "PACK", p: 0.68 },
];

export const DESTINATIONS = [
  { name: "SHARJAH", angle: -45, radius: 140 },
  { name: "AJMAN", angle: 0, radius: 150 },
  { name: "RAS AL KHAIMAH", angle: 45, radius: 160 },
  { name: "MASAFI", angle: 90, radius: 140 },
  { name: "DIBBA", angle: 135, radius: 150 },
  { name: "KHORFAKKAN", angle: 180, radius: 160 },
  { name: "FUJAIRAH", angle: 225, radius: 150 },
  { name: "KALBA", angle: 270, radius: 140 },
];

export const SHELF_TIMELINE = [
  { progress: 0.82, label: "DAY 01" },
  { progress: 0.87, label: "MONTH 01" },
  { progress: 0.92, label: "MONTH 03" },
  { progress: 0.97, label: "MONTH 06" },
];
