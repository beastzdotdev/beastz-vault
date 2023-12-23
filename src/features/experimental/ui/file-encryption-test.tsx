import { useState } from 'react';
import { encryption } from '../../../shared/encryption';

function getStringInputNoMatterWhat(text?: string): string {
  let isValidInput = false;
  let userInput: string | null = null;

  // Continue prompting until a valid string is entered
  while (!isValidInput) {
    userInput = window.prompt(text ?? 'Enter a string:');

    // Check if the user clicked Cancel or entered a non-empty string
    if (userInput === null) {
      alert('No input provided. Please enter a string.');
    } else if (userInput.trim() !== '') {
      isValidInput = true; // Set the flag to exit the loop
    } else {
      alert('Empty input. Please enter a non-empty string.');
    }
  }

  if (!userInput) {
    throw new Error('Something went wrong with input');
  }

  return userInput;
}

function saveFile(params: { bytes: Uint8Array; fileName: string }): void {
  const { bytes, fileName } = params;

  const blob = new Blob([bytes], { type: 'application/download' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

function readFileAsBytes(file: File): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      resolve(new Uint8Array(event.target?.result as ArrayBuffer));
    };

    reader.onerror = function (event) {
      console.log('='.repeat(20));
      console.log(event.target?.error);

      reject(null);
    };

    reader.readAsArrayBuffer(file);
  });
}

export const FileEncryptionTest = (): React.JSX.Element => {
  const [file, setFile] = useState<File | null>(null);

  const enc = async () => {
    if (!file) {
      throw new Error('File not found');
    }

    const fileBytes = await readFileAsBytes(file);

    if (!fileBytes) {
      throw new Error('File cannot be read');
    }

    const secret = getStringInputNoMatterWhat('Please enter secret to encrypt file: ');

    const encryptedFile = await encryption.aes256gcm.encryptBuffer(fileBytes, secret);
    saveFile({
      bytes: encryptedFile,
      fileName: file.name + '.enc',
    });
  };

  const dec = async () => {
    if (!file) {
      throw new Error('File not found');
    }

    const fileBytes = await readFileAsBytes(file);

    if (!fileBytes) {
      throw new Error('File cannot be read');
    }

    const secret = getStringInputNoMatterWhat('Please enter secret to decrypt file: ');

    try {
      const decryptedFile = await encryption.aes256gcm.decryptBuffer(fileBytes, secret);
      saveFile({
        bytes: decryptedFile,
        fileName: file.name.includes('.enc') ? file.name.replace('.enc', '') : file.name,
      });
    } catch (error) {
      alert('Inccorect secret');
    }
  };

  function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      throw new Error('No file found');
    }

    setFile(file);
  }

  return (
    <div className="w-fit mx-auto mt-20">
      <h1>hello</h1>

      {file && (
        <>
          <br />
          <hr />
          <div>
            <p>{file?.name}</p>
            <p>{file?.size}</p>
            <p>{file?.type}</p>
          </div>
          <hr />
          <br />
        </>
      )}

      <input type="file" name="myFile" onChange={uploadFile} />

      <button className="bp5-button bp5-intent-primary" onClick={enc}>
        encrypt
      </button>
      <button className="bp5-button bp5-intent-primary" onClick={dec}>
        decrypt
      </button>
    </div>
  );
};
