function buf2hex(buffer) { // buffer is an ArrayBuffer
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function emojiHash(string = undefined, hashLength = 1, fn) {
  const encoder = new TextEncoder()
  
  return window.crypto.subtle.digest('SHA-256', encoder.encode(string))
    .then((digest) => {
      const hexHash = buf2hex(new Uint8Array(digest).buffer)
      const decimalHash = parseInt(hexHash, 16);
    
      let emojiIndex = decimalHash % Math.pow(emojis.length, hashLength);
    
      let emojiString = '';
      for (let ii = 0; ii < hashLength; ii++) {
        emojiString = `${emojis[emojiIndex % emojis.length]}${emojiString}`;
        emojiIndex = Math.floor(emojiIndex / emojis.length);
      }
      return emojiString
  })
}

const emojis = [
  "๐ฏ",
  "๐ข",
  "โน๏ธ",
  "โ",
  "โคด๏ธ",
  "โคต๏ธ",
  "ใ๏ธ",
  "ใ๏ธ",
  "โ๏ธ",
  "โ๏ธ",
  "โฉ",
  "โช",
  "โซ",
  "โฌ",
  "โญ",
  "โฎ",
  "โฏ",
  "โฐ",
  "โฑ",
  "โฒ",
  "โณ",
  "โธ",
  "โน",
  "โบ",
  "โ๏ธ",
  "โช๏ธ",
  "โซ๏ธ",
  "โฐ",
  "โฑ",
  "โฝ๏ธ",
  "โพ๏ธ",
  "โ๏ธ",
  "โ๏ธ",
  "โ",
  "โ",
  "โ",
  "โ",
  "โ",
  "โ๏ธ",
  "โฉ",
  "โช๏ธ",
  "โฐ",
  "โฑ",
  "โฒ๏ธ",
  "โณ๏ธ",
  "โด",
  "โต๏ธ",
  "โท",
  "โธ",
  "โน",
  "โบ๏ธ",
  "โฝ๏ธ",
  "โ",
  "โ",
  "โ๏ธ",
  "โ",
  "โ๏ธ",
  "โ",
  "โ",
  "โ",
  "โก๏ธ",
  "โฐ",
  "โฟ",
  "โฌ๏ธ",
  "โฌ๏ธ",
  "โฌ๏ธ",
  "โฌ๏ธ",
  "โฌ๏ธ",
  "โญ๏ธ",
  "โญ๏ธ",
  "ใฝ๏ธ",
  "๐๏ธ",
  "๐",
  "๐ฐ๏ธ",
  "๐ฑ๏ธ",
  "๐พ๏ธ",
  "๐ฟ๏ธ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐๏ธ",
  "๐๏ธ",
  "๐ฏ๏ธ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท๏ธ",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ฐ",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐ฏ",
  "๐ฐ",
  "๐น",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐ฅ",
  "๐จ",
  "๐ฑ",
  "๐ฒ",
  "๐ผ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐ก",
  "๐ฃ",
  "๐จ",
  "๐ฏ",
  "๐ณ",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฆ",
  "๐ง",
  "๐จ",
  "๐ฉ",
  "๐ช",
  "๐ซ",
  "๐ฌ",
  "๐ญ",
  "๐ฎ",
  "๐ฏ",
  "๐ฐ",
  "๐ฑ",
  "๐ฒ",
  "๐ณ",
  "๐ด",
  "๐ต",
  "๐ถ",
  "๐ท",
  "๐ธ",
  "๐น",
  "๐บ",
  "๐ป",
  "๐ผ",
  "๐ฝ",
  "๐พ",
  "๐ฟ",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐",
  "๐?",
  "๐ก",
  "๐ข",
  "๐ฃ",
  "๐ค",
  "๐ฅ",
  "๐ฉ",
  "๐ซ",
  "๐ฌ",
  "๐ณ",
  "๐ค",
  "๐ค",
  "๐ค",
  "๐ค",
  "๐ค",
  "๐ค",
  "๐ค",
  "๐ค",
  "๐ค",
  "๐ฆ",
  "๐ฆ",
  "๐ฆ",
  "๐ฆ",
  "๐ฆ",
  "๐ง",
  "#๏ธโฃ",
  "*โฃ",
  "0๏ธโฃ",
  "1๏ธโฃ",
  "2๏ธโฃ",
  "3๏ธโฃ",
  "4๏ธโฃ",
  "5๏ธโฃ",
  "6๏ธโฃ",
  "7๏ธโฃ",
  "8๏ธโฃ",
  "9๏ธโฃ",
  "๐ฆ๐จ",
  "๐ฆ๐ฉ",
  "๐ฆ๐ช",
  "๐ฆ๐ซ",
  "๐ฆ๐ฌ",
  "๐ฆ๐ฎ",
  "๐ฆ๐ฑ",
  "๐ฆ๐ฒ",
  "๐ฆ๐ด",
  "๐ฆ๐ถ",
  "๐ฆ๐ท",
  "๐ฆ๐ธ",
  "๐ฆ๐น",
  "๐ฆ๐บ",
  "๐ฆ๐ผ",
  "๐ฆ๐ฝ",
  "๐ฆ๐ฟ",
  "๐ง๐ฆ",
  "๐ง๐ง",
  "๐ง๐ฉ",
  "๐ง๐ช",
  "๐ง๐ซ",
  "๐ง๐ฌ",
  "๐ง๐ญ",
  "๐ง๐ฎ",
  "๐ง๐ฏ",
  "๐ง๐ฑ",
  "๐ง๐ฒ",
  "๐ง๐ณ",
  "๐ง๐ด",
  "๐ง๐ถ",
  "๐ง๐ท",
  "๐ง๐ธ",
  "๐ง๐น",
  "๐ง๐ป",
  "๐ง๐ผ",
  "๐ง๐พ",
  "๐ง๐ฟ",
  "๐จ๐ฆ",
  "๐จ๐จ",
  "๐จ๐ฉ",
  "๐จ๐ซ",
  "๐จ๐ฌ",
  "๐จ๐ญ",
  "๐จ๐ฎ",
  "๐จ๐ฐ",
  "๐จ๐ฑ",
  "๐จ๐ฒ",
  "๐จ๐ณ",
  "๐จ๐ด",
  "๐จ๐ต",
  "๐จ๐ท",
  "๐จ๐บ",
  "๐จ๐ป",
  "๐จ๐ผ",
  "๐จ๐ฝ",
  "๐จ๐พ",
  "๐จ๐ฟ",
  "๐ฉ๐ช",
  "๐ฉ๐ฌ",
  "๐ฉ๐ฏ",
  "๐ฉ๐ฐ",
  "๐ฉ๐ฒ",
  "๐ฉ๐ด",
  "๐ฉ๐ฟ",
  "๐ช๐ฆ",
  "๐ช๐จ",
  "๐ช๐ช",
  "๐ช๐ฌ",
  "๐ช๐ญ",
  "๐ช๐ท",
  "๐ช๐ธ",
  "๐ช๐น",
  "๐ช๐บ",
  "๐ซ๐ฎ",
  "๐ซ๐ฏ",
  "๐ซ๐ฐ",
  "๐ซ๐ฒ",
  "๐ซ๐ด",
  "๐ซ๐ท",
  "๐ฌ๐ฆ",
  "๐ฌ๐ง",
  "๐ฌ๐ฉ",
  "๐ฌ๐ช",
  "๐ฌ๐ซ",
  "๐ฌ๐ฌ",
  "๐ฌ๐ญ",
  "๐ฌ๐ฎ",
  "๐ฌ๐ฑ",
  "๐ฌ๐ฒ",
  "๐ฌ๐ณ",
  "๐ฌ๐ต",
  "๐ฌ๐ถ",
  "๐ฌ๐ท",
  "๐ฌ๐ธ",
  "๐ฌ๐น",
  "๐ฌ๐บ",
  "๐ฌ๐ผ",
  "๐ฌ๐พ",
  "๐ญ๐ฐ",
  "๐ญ๐ฒ",
  "๐ญ๐ณ",
  "๐ญ๐ท",
  "๐ญ๐น",
  "๐ญ๐บ",
  "๐ฎ๐จ",
  "๐ฎ๐ฉ",
  "๐ฎ๐ช",
  "๐ฎ๐ฑ",
  "๐ฎ๐ฒ",
  "๐ฎ๐ณ",
  "๐ฎ๐ด",
  "๐ฎ๐ถ",
  "๐ฎ๐ท",
  "๐ฎ๐ธ",
  "๐ฎ๐น",
  "๐ฏ๐ช",
  "๐ฏ๐ฒ",
  "๐ฏ๐ด",
  "๐ฏ๐ต",
  "๐ฐ๐ช",
  "๐ฐ๐ฌ",
  "๐ฐ๐ญ",
  "๐ฐ๐ฎ",
  "๐ฐ๐ฒ",
  "๐ฐ๐ณ",
  "๐ฐ๐ต",
  "๐ฐ๐ท",
  "๐ฐ๐ผ",
  "๐ฐ๐พ",
  "๐ฐ๐ฟ",
  "๐ฑ๐ฆ",
  "๐ฑ๐ง",
  "๐ฑ๐จ",
  "๐ฑ๐ฎ",
  "๐ฑ๐ฐ",
  "๐ฑ๐ท",
  "๐ฑ๐ธ",
  "๐ฑ๐น",
  "๐ฑ๐บ",
  "๐ฑ๐ป",
  "๐ฑ๐พ",
  "๐ฒ๐ฆ",
  "๐ฒ๐จ",
  "๐ฒ๐ฉ",
  "๐ฒ๐ช",
  "๐ฒ๐ซ",
  "๐ฒ๐ฌ",
  "๐ฒ๐ญ",
  "๐ฒ๐ฐ",
  "๐ฒ๐ฑ",
  "๐ฒ๐ฒ",
  "๐ฒ๐ณ",
  "๐ฒ๐ด",
  "๐ฒ๐ต",
  "๐ฒ๐ถ",
  "๐ฒ๐ท",
  "๐ฒ๐ธ",
  "๐ฒ๐น",
  "๐ฒ๐บ",
  "๐ฒ๐ป",
  "๐ฒ๐ผ",
  "๐ฒ๐ฝ",
  "๐ฒ๐พ",
  "๐ฒ๐ฟ",
  "๐ณ๐ฆ",
  "๐ณ๐จ",
  "๐ณ๐ช",
  "๐ณ๐ซ",
  "๐ณ๐ฌ",
  "๐ณ๐ฎ",
  "๐ณ๐ฑ",
  "๐ณ๐ด",
  "๐ณ๐ต",
  "๐ณ๐ท",
  "๐ณ๐บ",
  "๐ณ๐ฟ",
  "๐ด๐ฒ",
  "๐ต๐ฆ",
  "๐ต๐ช",
  "๐ต๐ซ",
  "๐ต๐ฌ",
  "๐ต๐ญ",
  "๐ต๐ฐ",
  "๐ต๐ฑ",
  "๐ต๐ฒ",
  "๐ต๐ณ",
  "๐ต๐ท",
  "๐ต๐ธ",
  "๐ต๐น",
  "๐ต๐ผ",
  "๐ต๐พ",
  "๐ถ๐ฆ",
  "๐ท๐ช",
  "๐ท๐ด",
  "๐ท๐ธ",
  "๐ท๐บ",
  "๐ท๐ผ",
  "๐ธ๐ฆ",
  "๐ธ๐ง",
  "๐ธ๐จ",
  "๐ธ๐ฉ",
  "๐ธ๐ช",
  "๐ธ๐ฌ",
  "๐ธ๐ญ",
  "๐ธ๐ฎ",
  "๐ธ๐ฏ",
  "๐ธ๐ฐ",
  "๐ธ๐ฑ",
  "๐ธ๐ฒ",
  "๐ธ๐ณ",
  "๐ธ๐ด",
  "๐ธ๐ท",
  "๐ธ๐ธ",
  "๐ธ๐น",
  "๐ธ๐ป",
  "๐ธ๐ฝ",
  "๐ธ๐พ",
  "๐ธ๐ฟ",
  "๐น๐ฆ",
  "๐น๐จ",
  "๐น๐ฉ",
  "๐น๐ซ",
  "๐น๐ฌ",
  "๐น๐ญ",
  "๐น๐ฏ",
  "๐น๐ฐ",
  "๐น๐ฑ",
  "๐น๐ฒ",
  "๐น๐ณ",
  "๐น๐ด",
  "๐น๐ท",
  "๐น๐น",
  "๐น๐ป",
  "๐น๐ผ",
  "๐น๐ฟ",
  "๐บ๐ฆ",
  "๐บ๐ฌ",
  "๐บ๐ฒ",
  "๐บ๐พ",
  "๐บ๐ฟ",
  "๐ป๐ฆ",
  "๐ป๐จ",
  "๐ป๐ช",
  "๐ป๐ฌ",
  "๐ป๐ฎ",
  "๐ป๐ณ",
  "๐ป๐บ",
  "๐ผ๐ซ",
  "๐ผ๐ธ",
  "๐ฝ๐ฐ",
  "๐พ๐ช",
  "๐พ๐น",
  "๐ฟ๐ฆ",
  "๐ฟ๐ฒ",
  "๐ฟ๐ผ"
]