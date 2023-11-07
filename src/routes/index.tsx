// import CryptoJS from 'crypto-js';
import { Button } from '@blueprintjs/core';
import { api, apiPure } from '../shared/api/api';

class AuthenticationPayloadResponseDto {
  accessToken: string;
  refreshToken: string;
  hasEmailVerified?: boolean;
}

async function decryptSync(encryptedText: string, masterkey: string) {
  if (typeof encryptedText !== 'string') {
    throw new Error(`Decryption error: String not found, found ${typeof encryptedText}`);
  }

  // Decode base64 encoded string to a Uint8Array
  const encryptedData = new Uint8Array(Array.from(atob(encryptedText), c => c.charCodeAt(0)));

  console.log('='.repeat(20));
  console.log(encryptedData);

  // Extract salt, iv, tag, and ciphertext from the encrypted data
  const salt = encryptedData.slice(0, 64);
  const iv = encryptedData.slice(64, 80);
  const tag = encryptedData.slice(80, 96);
  const ciphertext = encryptedData.slice(96);

  // Derive the key using PBKDF2
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(masterkey),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  console.log('='.repeat(20));
  console.log(key);

  // name: 'aes-256-gcm' as const,

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 2145,
      hash: 'SHA-512',
    },
    key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  console.log('='.repeat(20));
  console.log('derivedKey');
  console.log(derivedKey);

  // Decrypt using AES-GCM
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      additionalData: salt,
      tagLength: 128,
    },
    derivedKey,
    ciphertext
  );

  console.log('='.repeat(20));
  console.log(decrypted);

  const decryptedText = new TextDecoder().decode(decrypted);
  return decryptedText;
}

export const Index = () => {
  const getUsers = async () => {
    const promises = [1, 2, 3].map(x =>
      api
        .get('user/current', { params: { x } })
        .then(e => {
          console.log('='.repeat(20) + 1);
          console.log(e);
          console.log(e.data.id);
        })
        .catch(e => {
          console.log('='.repeat(20) + 2);
          console.log(e);
        })
    );

    await Promise.all(promises);
  };

  const getUser = async () => {
    try {
      const { data } = await api.get('user/current');
      console.log('='.repeat(20));
      console.log(data);
    } catch (error) {
      console.log('='.repeat(20));
      console.log(error);
    }
  };

  const refresh = async () => {
    console.log('refresh');
  };

  const login = async () => {
    const { data } = await apiPure.post<AuthenticationPayloadResponseDto>('auth/sign-in', {
      email: 'demo@gmail.com',
      password: 'jsbyangtjt37*',
    });

    console.log(data);
  };

  const cryptoTest = async () => {
    const encryptedText =
      '5wz6l1gV0koGLwQiS+dw9Hcz/FjwRqjL0oF09jDvvA6xPexNQY0wXRuG9TYUkmaJxyvbBSCDwHEx6UWq7f0HLPBpYbeHgKOlykRiatb+5dzPh4fRw6PXB/fidO33TKIkTudjO94aYsdiK/8=';
    const masterkey = 'test key';

    // Usage
    const x = await decryptSync(encryptedText, masterkey);

    console.log('='.repeat(20));
    console.log(x);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>This is a demo for React Router.</div>
      <Button icon="log-out" intent="primary" text="get user" onClick={getUser} />
      <Button icon="log-out" intent="primary" text="get users" onClick={getUsers} />
      <Button icon="log-out" intent="warning" text="refresh" onClick={refresh} />
      <Button icon="log-out" intent="none" text="Login" onClick={login} />
      <Button icon="log-out" intent="none" text="crypto test" onClick={cryptoTest} />
    </div>
  );
};
