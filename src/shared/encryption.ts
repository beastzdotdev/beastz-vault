const stringEncode = (text: string): Uint8Array => new TextEncoder().encode(text);
const stringDecode = (buffer: ArrayBuffer): string => new TextDecoder().decode(buffer);
const base64Decode = (t: string) => {
  return new Uint8Array(
    atob(t)
      .split('')
      .map(c => c.charCodeAt(0))
  );
};

export const encryption = Object.freeze({
  pbkdf2: {
    async importKey(secret: Uint8Array) {
      return crypto.subtle.importKey('raw', secret, { name: 'PBKDF2' }, false, [
        'deriveBits',
        'deriveKey',
      ]);
    },

    async sync(secret: Uint8Array, salt: Uint8Array) {
      const subtleKey = await encryption.pbkdf2.importKey(secret);
      const keyLength = 32;

      return crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: 2145, hash: 'SHA-512' },
        subtleKey,
        keyLength * 8 // Convert bytes to bits
      );
    },

    async deriveKey(secret: Uint8Array, salt: Uint8Array) {
      const subtleKey = await encryption.pbkdf2.importKey(secret);
      const keyLength = 32;

      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 2145,
          hash: 'SHA-512',
        },
        subtleKey,
        { name: 'AES-GCM', length: keyLength * 8 },
        true,
        ['encrypt', 'decrypt']
      );
    },
  },

  aes256gcm: {
    async decryptWebCrypto(encryptedText: string, secret: string) {
      // base64 decoding
      const encryptedBuffer = base64Decode(encryptedText);

      // Convert data to buffers
      const salt = encryptedBuffer.slice(0, 64);
      const iv = encryptedBuffer.slice(64, 80);
      const authTag = encryptedBuffer.slice(80, 96);
      const text = encryptedBuffer.slice(96);

      const key = await encryption.pbkdf2.sync(stringEncode(secret), salt);

      const importedKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-GCM', length: 128 },
        true,
        ['decrypt', 'encrypt']
      );

      // try decryption
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', tagLength: 128, iv },
        importedKey,
        new Uint8Array([...text, ...authTag])
      );

      return stringDecode(decrypted);
    },

    async encryptWithWebCrypto(text: string, secret: string) {
      // Generate a random salt
      const salt = crypto.getRandomValues(new Uint8Array(64));

      // Generate a random initialization vector (IV)
      const iv = crypto.getRandomValues(new Uint8Array(16));

      const derivedKey = await encryption.pbkdf2.deriveKey(stringEncode(secret), salt);

      // Encrypt the text using AES-GCM
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        derivedKey,
        stringEncode(text)
      );

      const [value, authTag] = [
        encrypted.slice(0, encrypted.byteLength - 16),
        encrypted.slice(encrypted.byteLength - 16),
      ];

      // Generate output as a base64-encoded string
      const data = new Uint8Array(
        salt.byteLength + iv.byteLength + authTag.byteLength + value.byteLength
      );
      data.set(salt, 0);
      data.set(iv, salt.byteLength);
      data.set(new Uint8Array(authTag), salt.byteLength + iv.byteLength);
      data.set(new Uint8Array(value), salt.byteLength + iv.byteLength + authTag.byteLength);

      return btoa(String.fromCharCode(...data));
    },
  },
});
