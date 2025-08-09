// Hàm mã hóa/giải mã XOR đơn giản
function xorEncryptDecrypt(str, key) {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

// Chuyển string sang base64
function toBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// Chuyển base64 về string
function fromBase64(b64) {
    return decodeURIComponent(escape(atob(b64)));
}
