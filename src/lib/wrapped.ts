import Papa from "papaparse";

export type Message = { speaker: string; message: string };
export const MAX_CSV_BYTES = 1_000_000;

export const sampleMessages: Message[] = [
  { speaker: "Alex", message: "Wait, actually, can we open with the demo?" },
  { speaker: "Sam", message: "Sure. Can you run through your opening?" },
  { speaker: "Alex", message: "Wait, I have a better opening." },
  { speaker: "Alex", message: "Wait, actually, let's show the chart first." },
  { speaker: "Sam", message: "I can put the chart on slide two." },
  { speaker: "Alex", message: "Wait, did you move the slide?" },
  { speaker: "Alex", message: "Wait, actually, the slide looks great there." },
  { speaker: "Alex", message: "Wait, actually, can we rehearse once more?" },
  { speaker: "Sam", message: "Yep, give me five minutes." },
  { speaker: "Alex", message: "Wait, I'm grabbing coffee first." },
  { speaker: "Alex", message: "Okay, I'm back. Ready to run it?" },
];

export function parseMessages(csv: string): Message[] {
  if (!csv.trim()) throw new Error("This CSV is empty.");
  const { data, errors } = Papa.parse<string[]>(csv, {
    delimiter: ",",
    skipEmptyLines: "greedy",
  });
  const [headers, ...rows] = data;
  if (errors.length) throw new Error("Check the CSV for unclosed quotes.");
  const columns = headers.map((header) => header.trim().toLowerCase());
  const speaker = columns.indexOf("speaker");
  const message = columns.indexOf("message");
  if (speaker < 0 || message < 0 || new Set(columns).size !== columns.length) {
    throw new Error("Use a CSV with one speaker column and one message column.");
  }
  if (!rows.length) throw new Error("Add at least one message to your CSV.");
  return rows.map((row, index) => {
    if (row.length !== columns.length || !row[speaker].trim() || !row[message].trim()) {
      throw new Error(`Check record ${index + 1}. Every record needs a speaker and a message.`);
    }
    return { speaker: row[speaker].trim(), message: row[message].trim() };
  });
}

const common = new Set(
  "a about all also am an and are as at be been but by can could did do does for from had has have he her here him his how i i'm it its it's just me more my of on one or our s she so some t than that the their them then there they this to too up us very was we were what when where which who will with would you your you're".split(" "),
);

function topRepeated(counts: Map<string, number>) {
  return Array.from(counts, ([text, count]) => ({ text, count }))
    .filter(({ count }) => count > 1)
    .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text))[0];
}

function countPhrase(counts: Map<string, number>, phrase: string) {
  counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
}

export function analyzeMessages(messages: Message[], speaker: string) {
  const selected = messages.filter((entry) => entry.speaker === speaker);
  const words = new Map<string, number>();
  const phrases = new Map<string, number>();

  for (const { message } of selected) {
    for (const sentence of message.toLowerCase().replaceAll("’", "'").split(/[.!?\n]+/)) {
      const tokens = sentence.match(/\p{L}+(?:'\p{L}+)*/gu) ?? [];
      for (const [index, token] of tokens.entries()) {
        if (!common.has(token)) countPhrase(words, token);
        const next = tokens[index + 1];
        if (next && !common.has(token) && !common.has(next)) {
          countPhrase(phrases, `${token} ${next}`);
        }
      }
    }
  }

  return {
    total: selected.length,
    questions: selected.filter(({ message }) => message.includes("?")).length,
    word: topRepeated(words),
    phrase: topRepeated(phrases),
  };
}
