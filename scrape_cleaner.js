const fs = require('fs');
const cheerio = require('cheerio');

const rawHtml = fs.readFileSync('/Users/saad/.gemini/antigravity-ide/brain/e99d6060-063c-47f2-a304-e62a03f4d46a/.system_generated/steps/40/content.md', 'utf-8');

const $ = cheerio.load(rawHtml);
$('script, style, noscript').remove();
let text = $('body').text();
text = text.replace(/\s+/g, ' ').trim();
fs.writeFileSync('pathways2care_kb.txt', text);
console.log('Knowledge base saved to pathways2care_kb.txt');
