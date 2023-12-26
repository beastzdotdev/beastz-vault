import { useState } from 'react';
import { Button, Card, Elevation, FormGroup, InputGroup } from '@blueprintjs/core';
import { encryption, toast } from '../../../shared';

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

export const EncryptionTest = (): React.JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);

  const fileEncryption = async () => {
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

  const fileDecryption = async () => {
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

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      throw new Error('No file found');
    }

    setFile(file);
  };

  const handleTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const textEncryption = async () => {
    if (!text?.trim()) {
      throw new Error('Text not found');
    }

    const secret = getStringInputNoMatterWhat('Please enter secret to encrypt text: ');

    const encryptedText = await encryption.aes256gcm.encryptString(text, secret);
    setResultText(encryptedText);
  };

  const textDecryption = async () => {
    if (!text?.trim()) {
      throw new Error('Text not found');
    }

    const secret = getStringInputNoMatterWhat('Please enter secret to decrypt text: ');

    try {
      const decryptedText = await encryption.aes256gcm.decryptString(text, secret);
      setResultText(decryptedText);
    } catch (error) {
      alert('Inccorect secret');
    }
  };

  const copyToClipboard = () => {
    if (resultText?.trim()) {
      // Copy the text inside the text field
      navigator.clipboard.writeText(resultText);

      toast.showDefaultMessage('Copied to clipboard');
    }
  };

  return (
    <div className="flex flex-col w-fit">
      <div>
        <p className="text-lg pb-3">File encryption</p>

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

        <button className="bp5-button bp5-intent-primary mr-2" onClick={fileEncryption}>
          encrypt
        </button>
        <button className="bp5-button bp5-intent-primary" onClick={fileDecryption}>
          decrypt
        </button>
      </div>

      <br />
      <hr />
      <br />

      <div>
        <p className="text-lg pb-3">Text encryption</p>

        <FormGroup labelFor="text-input">
          <InputGroup id="text-input" placeholder="enter text here" onChange={handleTextInput} />
        </FormGroup>

        <button className="bp5-button bp5-intent-primary mr-2" onClick={textEncryption}>
          encrypt
        </button>
        <button className="bp5-button bp5-intent-primary" onClick={textDecryption}>
          decrypt
        </button>

        {resultText && (
          <Card elevation={Elevation.TWO} className="mt-5" compact>
            <p className="break-words">{resultText}</p>

            <Button className="mt-3" onClick={copyToClipboard}>
              Copy
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
