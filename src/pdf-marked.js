export const pdfrender = {
  name: 'pdfrender',
  level: 'inline',
  start: src => src.match(/!\{/)?.index,
  tokenizer(src, _) {
    const match = /^!\{(.*?)\}/.exec(src);
    if (match) {
      return {
        type: 'pdfrender',
        text: match[1],
        raw: match[0],
      };
    }
  },
  renderer: token => `<object data="${token.text}" type="application/pdf"><embed src="${token.text}"><p>Can't dispaly PDF on this browser. Please <a href="${token.text}">download the PDF</a> instead</p></embed></object>`,
}
