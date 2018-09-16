const tf = require("@tensorflow/tfjs");


const tokenizeRegexp = new RegExp(/[\w']+|[,.?;\-()]/g);
const sentTokenizeRegexp = new RegExp(/(?=[.?!])/g);

const sentTokenize = (text) => text.split(sentTokenizeRegexp).reduce((agg, item) => {
    if (agg.length === 0) {
        agg.push(item);
    } else {
        if (item.length > 0) {
            agg[agg.length - 1] += item[0];
            agg.push(item.slice(1));
        }
    }
    return agg;
}, []).filter(chunk => /\w/.test(chunk));

const tokenize = (text) => (text.toLowerCase().match(tokenizeRegexp) || []);

module.exports = {
    tokenize,
    sentTokenize
};
