import natural from "natural";

const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

export function scoreReview(text) {
  const tokens = text.toLowerCase().split(/\s+/).filter(Boolean);
  return analyzer.getSentiment(tokens);
}
