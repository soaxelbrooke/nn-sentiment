const tf = require("@tensorflow/tfjs");

const seqLen = 100;

const tokenizeRegexp = new RegExp(/[\w']+|[,.?;\-()]/g);
const sentTokenizeRegexp = new RegExp(/(?=[.?!])/g);
let model = null;
let wordIndexes = null;

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

const batchArray = (array, batchSize) =>
  array.reduce((a, b, i, g) => (!(i % batchSize) ? a.concat([g.slice(i, i + batchSize)]) : a), []);

const vectorizeBatch = (wordIndexes, batch) => {
  return tf.tensor(
    batch.map(tokens => {
      const wordIdxs = tokens.map(tok => wordIndexes[tok] || 0).slice(0, seqLen);
      return wordIdxs.concat(Array.from({ length: seqLen - wordIdxs.length }, () => 0));
    })
  );
};

const getModel = modelUrl => {
  if (model === null) {
    return tf.loadModel(modelUrl).then(m => {
      model = m;
      return model;
    });
  } else {
    return Promise.resolve(model);
  }
};

const getWordIndexes = wordIndexesUrl => {
  if (wordIndexes === null) {
    return fetch(wordIndexesUrl)
      .then(r => r.json())
      .then(wi => {
        wordIndexes = wi;
        return wordIndexes;
      });
  } else {
    return Promise.resolve(wordIndexes);
  }
};

const predict = (modelBasePath, texts) => {
  return predictProba(modelBasePath, texts).then(probas =>
    probas.map(prediction => {
      if (prediction.detractor > 0.4) {
        prediction.detractor = 1;
        prediction.neutral = 0;
        prediction.promoter = 0;
      } else if (prediction.promoter > 0.8) {
        prediction.detractor = 0;
        prediction.neutral = 0;
        prediction.promoter = 1;
      } else {
        prediction.detractor = 0;
        prediction.neutral = 1;
        prediction.promoter = 0;
      }
      return prediction;
    })
  );
};

const predictProba = (modelBasePath, texts) => {
  return Promise.all([
    getModel(modelBasePath + "/model.json"),
    getWordIndexes(modelBasePath + "/word_index.json"),
  ]).then(([model, wordIndexes]) =>
    model
      .predict(vectorizeBatch(wordIndexes, texts.map(tokenize)))
      .data()
      .then(predictions => batchArray(predictions, 3))
      .then(probas =>
        probas.map((proba, idx) => ({
          text: texts[idx],
          promoter: proba[2],
          neutral: proba[1],
          detractor: proba[0],
        }))
      )
  );
};

module.exports = {
  tokenize,
  sentTokenize,
  vectorizeTokens,
  vectorizeBatch,
  predict,
  predictProba,
  getModel,
  getWordIndexes,
};
