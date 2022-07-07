import { scale } from "chroma-js";

export const grades = ["A", "B", "C", "D", "E", "F"];

export const initialWeights = { w1: 1, w2: 1, w3: 1, w4: 1 };

export const colors = scale(["#FFB35C", "#1F91AD"]).colors(6);