import natural from "natural";
import { gifts } from "./data/items.js";

const tokenizer = new natural.WordTokenizer();

export function tokenizeGiftNames() {
  return gifts.map((gift) => tokenizer.tokenize(gift.name.toLowerCase()));
}
