export const stringEncode = (text: string): Uint8Array => new TextEncoder().encode(text);
export const stringDecode = (buffer: ArrayBuffer): string => new TextDecoder().decode(buffer);
export const base64Decode = (t: string) => {
  return new Uint8Array(
    atob(t)
      .split('')
      .map(c => c.charCodeAt(0))
  );
};

const privateEncryption = Object.freeze({
  pbkdf2: {
    async derive(masterKey: string) {
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(masterKey);

      const key = await crypto.subtle.importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, [
        'deriveKey',
      ]);

      // Derive a key using PBKDF2 and use it for AES-256-CTR
      const aesKey = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: crypto.getRandomValues(new Uint8Array(16)),
          iterations: 100000,
          hash: 'SHA-256',
        },
        key,
        { name: 'AES-CTR', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      return aesKey;
    },

    async importKey(secret: Uint8Array) {
      return crypto.subtle.importKey('raw', secret, { name: 'PBKDF2' }, false, [
        'deriveBits',
        'deriveKey',
      ]);
    },

    async deriveBits(secret: Uint8Array, salt: Uint8Array) {
      const subtleKey = await privateEncryption.pbkdf2.importKey(secret);
      const keyLength = 32;

      return crypto.subtle.deriveBits(
        { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-512' },
        subtleKey,
        keyLength * 8 // Convert bytes to bits
      );
    },

    async deriveKey(secret: Uint8Array, salt: Uint8Array) {
      const subtleKey = await privateEncryption.pbkdf2.importKey(secret);
      const keyLength = 32;

      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: 100000,
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
    async decrypt(buffer: Uint8Array, secret: string): Promise<Uint8Array> {
      // Convert data to buffers
      const salt = buffer.slice(0, 64);
      const iv = buffer.slice(64, 80);
      const authTag = buffer.slice(80, 96);
      const text = buffer.slice(96);

      const key = await privateEncryption.pbkdf2.deriveBits(stringEncode(secret), salt);

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

      return new Uint8Array(decrypted);
    },

    async encrypt(buffer: Uint8Array, secret: string): Promise<Uint8Array> {
      // Generate a random salt
      const salt = crypto.getRandomValues(new Uint8Array(64));

      // Generate a random initialization vector (IV)
      const iv = crypto.getRandomValues(new Uint8Array(16));

      const derivedKey = await privateEncryption.pbkdf2.deriveKey(stringEncode(secret), salt);

      // Encrypt the text using AES-GCM
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, derivedKey, buffer);

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

      return data;
    },
  },
});

/**
 * @description This object is public use of browser encryption on string, buffer, etc
 */
export const encryption = Object.freeze({
  aes256gcm: {
    async encryptBuffer(buffer: Uint8Array, secret: string): Promise<Uint8Array> {
      return privateEncryption.aes256gcm.encrypt(buffer, secret);
    },

    async decryptBuffer(buffer: Uint8Array, secret: string): Promise<Uint8Array> {
      return privateEncryption.aes256gcm.decrypt(buffer, secret);
    },

    async encryptString(text: string, secret: string): Promise<string> {
      const encrypted = await privateEncryption.aes256gcm.encrypt(stringEncode(text), secret);
      return btoa(String.fromCharCode(...encrypted));
    },

    async decryptString(text: string, secret: string): Promise<string> {
      const decrypted = await privateEncryption.aes256gcm.decrypt(base64Decode(text), secret);
      return stringDecode(decrypted);
    },
  },
});
