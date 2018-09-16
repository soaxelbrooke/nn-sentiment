const tf = require("@tensorflow/tfjs");

const seqLen = 100;

const tokenizeRegexp = new RegExp(/[\w']+|[,.?;\-()]/g);
const sentTokenizeRegexp = new RegExp(/(?=[.?!])/g);

const sentTokenize = text =>
  text
    .split(sentTokenizeRegexp)
    .reduce((agg, item) => {
      if (agg.length === 0) {
        agg.push(item);
      } else {
        if (item.length > 0) {
          agg[agg.length - 1] += item[0];
          agg.push(item.slice(1));
        }
      }
      return agg;
    }, [])
    .filter(chunk => /\w/.test(chunk));

const tokenize = text => text.toLowerCase().match(tokenizeRegexp) || [];

const vectorizeTokens = (wordIndexes, tokens) => {
  const wordIdxs = tokens.map(tok => wordIndexes[tok] || 0).slice(0, seqLen);
  return tf.tensor([wordIdxs.concat(Array.from({ length: seqLen - wordIdxs.length }, () => 0))]);
};

const vectorizeBatch = (wordIndexes, batch) => {
  return tf.tensor(
    batch.map(tokens => {
      const wordIdxs = tokens.map(tok => wordIndexes[tok] || 0).slice(0, seqLen);
      return wordIdxs.concat(Array.from({ length: seqLen - wordIdxs.length }, () => 0));
    })
  );
};

module.exports = {
  tokenize,
  sentTokenize,
  vectorizeTokens,
  vectorizeBatch,
};
