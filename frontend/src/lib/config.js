import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const MUSIC_TRACKS = [
  {
    id: "piano",
    name: "Soft Piano",
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    id: "lofi",
    name: "Warm Lo-fi",
    url: "https://cdn.pixabay.com/audio/2022/10/30/audio_347ec0d837.mp3",
  },
  {
    id: "acoustic",
    name: "Acoustic Hearts",
    url: "https://cdn.pixabay.com/audio/2023/06/19/audio_3d49bbc3b9.mp3",
  },
  {
    id: "ambient",
    name: "Calm Ambient",
    url: "https://cdn.pixabay.com/audio/2024/02/06/audio_aaccfcacef.mp3",
  },
];

export const FONT_OPTIONS = [
  { id: "cormorant", name: "Elegant Serif", className: "font-cormorant" },
  { id: "dancing", name: "Heartfelt Script", className: "font-dancing" },
  { id: "caveat", name: "Handwritten", className: "font-caveat" },
  { id: "playfair", name: "Editorial", className: "font-playfair" },
  { id: "outfit", name: "Modern Sans", className: "font-outfit" },
];

export const FRAME_OPTIONS = [
  { id: "none", name: "None" },
  { id: "soft", name: "Soft Border" },
  { id: "double", name: "Double Line" },
  { id: "ornate", name: "Ornate" },
  { id: "deckle", name: "Deckle Edge" },
];

export const COLOR_PALETTE = [
  "#FDFBF7",
  "#FFFFFF",
  "#F4E3D7",
  "#E9EDC9",
  "#FCD5CE",
  "#F8EDEB",
  "#F0EFEB",
  "#E07A5F",
  "#81B29A",
  "#2C362B",
];

export const STICKER_LIBRARY = [
  { type: "Heart", name: "Heart" },
  { type: "Flower", name: "Flower" },
  { type: "Sparkles", name: "Sparkles" },
  { type: "Star", name: "Star" },
  { type: "Sun", name: "Sun" },
  { type: "Cloud", name: "Cloud" },
  { type: "Moon", name: "Moon" },
  { type: "Gift", name: "Gift" },
  { type: "Cake", name: "Cake" },
  { type: "Crown", name: "Crown" },
  { type: "Leaf", name: "Leaf" },
  { type: "Cherry", name: "Cherry" },
];
