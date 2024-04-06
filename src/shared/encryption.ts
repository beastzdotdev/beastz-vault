import { stringEncode, base64Decode, stringDecode } from './helper';

const privateEncryption = Object.freeze({
  pbkdf2: {
    constants: {
      pbkdf2IterationCountOnSHA512: 210000, // recommended amount
      keyLengthInBits: 256, // 32 * 8 - must be multiplied by 8 for bit conversion
    },

    async importKey(secret: Uint8Array) {
      return crypto.subtle.importKey('raw', secret, { name: 'PBKDF2' }, false, [
        'deriveBits',
        'deriveKey',
      ]);
    },

    async deriveBits(secret: Uint8Array, salt: Uint8Array) {
      const subtleKey = await privateEncryption.pbkdf2.importKey(secret);

      return crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt,
          iterations: privateEncryption.pbkdf2.constants.pbkdf2IterationCountOnSHA512,
          hash: 'SHA-512',
        },
        subtleKey,
        privateEncryption.pbkdf2.constants.keyLengthInBits
      );
    },

    async deriveKey(secret: Uint8Array, salt: Uint8Array) {
      const subtleKey = await privateEncryption.pbkdf2.importKey(secret);

      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: privateEncryption.pbkdf2.constants.pbkdf2IterationCountOnSHA512,
          hash: 'SHA-512',
        },
        subtleKey,
        {
          name: 'AES-GCM',
          length: privateEncryption.pbkdf2.constants.keyLengthInBits,
        },
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
        {
          name: 'AES-GCM',
          length: 128,
        },
        true,
        ['decrypt', 'encrypt']
      );

      // try decryption
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          tagLength: 128,
          iv,
        },
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
