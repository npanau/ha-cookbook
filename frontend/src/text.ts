// Ligatures that Unicode decomposition leaves untouched ("œufs" must match "oeufs").
const LIGATURES: Record<string, string> = { œ: "oe", Œ: "oe", æ: "ae", Æ: "ae" };

function foldChar(char: string): string {
  return (LIGATURES[char] ?? char).normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
}

/** Lowercase, without accents nor ligatures — same rule as the backend `fold()`. */
export function fold(text: string): string {
  return [...text].map(foldChar).join("");
}

export interface Segment {
  text: string;
  match: boolean;
}

/** Splits `text` into matching / non-matching parts for the words of `query`. */
export function highlight(text: string, query: string): Segment[] {
  const tokens = fold(query).split(/\s+/).filter(Boolean);
  const chars = [...text];
  // Folded text, and for each of its code units the index of the original character.
  let folded = "";
  const origin: number[] = [];
  chars.forEach((char, index) => {
    const part = foldChar(char);
    folded += part;
    for (let unit = 0; unit < part.length; unit++) origin.push(index);
  });

  const marked = new Array<boolean>(chars.length).fill(false);
  for (const token of tokens) {
    for (let at = folded.indexOf(token); at !== -1; at = folded.indexOf(token, at + token.length)) {
      for (let unit = at; unit < at + token.length; unit++) marked[origin[unit]] = true;
    }
  }

  const segments: Segment[] = [];
  chars.forEach((char, index) => {
    const last = segments.at(-1);
    if (last && last.match === marked[index]) last.text += char;
    else segments.push({ text: char, match: marked[index] });
  });
  return segments;
}
