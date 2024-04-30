import { H2, H4 } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { constants } from '../../shared/constants';

export const GuidePage = () => {
  return (
    <div className="px-2.5 pt-3 cursor-default">
      <H2>Supported files</H2>

      <ol>
        <li>Text</li>
        <li>Image</li>
        <li>Audio</li>
        <li>Video</li>
      </ol>

      <H4 className="font-bold mt-10">Existing feature guides</H4>
      <hr />
      <ol className="list-decimal list-inside">
        <li>
          State change
          <ol className="list-decimal list-inside pl-5">
            <li>
              Sorry but some ui changes require page reload to take effect (will be resolved in next
              version)
            </li>
          </ol>
        </li>

        <li>
          Encryption
          <ol className="list-decimal list-inside pl-5">
            <li>
              <strong className="italic text-red-600">
                Password is not stored anywhere except your mind, so if you forget password, it will
                be over
              </strong>
            </li>
            <li>
              For now encrypt will replace existing file and it won't be returnable and only way to
              see whats inside is to decrypt it using browser using password
            </li>
            <li>
              Decrypted file inside browser will be{' '}
              <strong className="italic text-red-400">READONLY</strong>
            </li>
            <li>
              You can't download decrypted file,{' '}
              <strong className="italic text-red-400">
                ONLY ENCRYPTED FILE WILL BE DOWNLOADABLE
              </strong>
            </li>
            <li>
              Check out our{' '}
              <strong className="italic text-yellow-400">
                public encryption <Link to={constants.path.openEncryption.mini}>"/oe"</Link> and
                <Link to={constants.path.openEncryption.full}>"/open-encryption"</Link>
              </strong>{' '}
              no need for authentication, it's dead simple to use
            </li>
            <li>
              Encrypted file won't be decrypted inside{' '}
              <strong className="italic text-red-400">BIN</strong>
            </li>
          </ol>
        </li>
      </ol>

      <H4 className="font-bold mt-10">Future features</H4>
      <hr />
      <ol className="list-decimal list-inside">
        <li>
          Encryption
          <ol className="list-decimal list-inside pl-5">
            <li>Folder encryption</li>
          </ol>
        </li>
        <li>Notification</li>
        <li>
          Page is not responsive for smaller devices mobile application will be added in future
        </li>
      </ol>
    </div>
  );
};
