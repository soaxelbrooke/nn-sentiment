const { tokenize, sentTokenize, vectorizeTokens } = require("../src/index");

describe("tokenize", () => {
  test("splits and lowercases", () => {
    const tokenized = tokenize("This is how we do it.");
    expect(tokenized[0]).toBe("this");
    expect(tokenized[tokenized.length - 1]).toBe(".");
    expect(tokenized.length).toEqual(7);
  });

  test("splits sentences", () => {
    const sentTokenized = sentTokenize(
      "This is how we do it. It's Friday night, and I feel" +
        " all right, and the party's here on the west side. So I reach for my 40 and I turn it " +
        "up. Designated driver take the keys to my truck."
    );
    expect(sentTokenized.length).toEqual(4);
  });

  test("empty texts", () => {
    const tokenized = tokenize("");
    expect(Array.isArray(tokenized)).toBe(true);
    expect(tokenized.length).toEqual(0);

    const sentTokenized = sentTokenize("");
    expect(Array.isArray(sentTokenized)).toBe(true);
    expect(sentTokenized.length).toEqual(0);
  });
});

describe("vectorize", () => {
  const wordIndexes = {
    this: 1,
    is: 2,
    how: 3,
    do: 4,
    it: 5,
    ".": 6,
  };

  test("turns tokenized text into word indexes", () => {
    const tokens = ["this", "is", "how", "we", "do", "it", "."];
    const vectorized = vectorizeTokens(wordIndexes, tokens).dataSync();
    expect(vectorized[0]).toEqual(wordIndexes["this"]);
    expect(vectorized[3]).toEqual(0);
    expect(vectorized[6]).toEqual(6);
    expect(vectorized.length).toEqual(100);
  });
});
