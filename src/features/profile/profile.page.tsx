import moment from 'moment';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { useInjection } from 'inversify-react';
import { useNavigate } from 'react-router-dom';
import { DateInput3 } from '@blueprintjs/datetime2';
import { Suspense, useRef, useState } from 'react';
import {
  Button,
  Card,
  ControlGroup,
  Elevation,
  FormGroup,
  H2,
  H3,
  H5,
  HTMLSelect,
  Icon,
  InputGroup,
  Intent,
} from '@blueprintjs/core';

import { ProfileStore } from './state/profile.store';
import { constants } from '../../shared/constants';
import { toast } from '../../shared/ui';
import { differentiateObj, fields, zodFormikErrorAdapter } from '../../shared/helper';
import { profileUpdateValidation } from './validation/profile-update-validation';
import { FormErrorMessage } from '../../components/form-error-message';
import { Gender } from '../../shared/enum';
import { UpdateUserDetailsDto, UserApiService } from '../../shared/api';
import { DefaultLogo } from '../shared/widgets/default-logo';

export const ProfilePage = observer((): React.JSX.Element => {
  const navigate = useNavigate();
  const profileStore = useInjection(ProfileStore);
  const userApiService = useInjection(UserApiService);

  const form = useFormik({
    initialValues: {
      userName: profileStore.user.userName,
      birthDate: profileStore.user.birthDate,
      gender: profileStore.user.gender,
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(profileUpdateValidation),
    onSubmit: async values => {
      const { obj: updatedObj, isEmpty } = differentiateObj<UpdateUserDetailsDto>(
        values,
        profileStore.user
      );

      if (isEmpty) {
        return;
      }

      const { data, error } = await userApiService.update(updatedObj);

      if (!data || error) {
        toast.error(error?.message || 'Sorry, something went wrong');
        return;
      }

      // replace user
      profileStore.setUser(data);

      form.setValues({
        userName: data.userName,
        birthDate: data.birthDate,
        gender: data.gender,
      });

      // /profile-image-15647b3b-3b4d-4614-98c9-f4fc8d165cdb.jpeg
    },
  });
  const formFields = fields<(typeof form)['initialValues']>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  //TODO
  const WebSignOut = async () => {
    try {
      navigate(constants.path.signIn);
    } catch (e: unknown) {
      // showErrorMessage(handleFirebaseError(e));
    }
  };

  const SIZE = 150;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.showMessage('Copied to clipboard');
  };

  const ref = useRef<HTMLInputElement>(null);

  const onImgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const { data, error } = await userApiService.updateProfileImage(file);

    if (!data || error) {
      toast.error(error?.message || 'Sorry, something went wrong');
      return;
    }

    // replace user
    profileStore.setUser(data);
  };

  return (
    <>
      <div className="px-2.5 pt-3 cursor-default">
        <H2 className="font-extralight">Profile</H2>

        <div style={{ marginTop: SIZE / 2 + 40 }} className="flex">
          <Card
            interactive={true}
            elevation={Elevation.ZERO}
            className="relative flex-[1] !shadow-none min-w-80"
          >
            <div
              className="absolute select-none left-1/2 -translate-x-1/2"
              style={{ top: -(SIZE / 2) }}
            >
              <div
                style={{
                  width: SIZE,
                  height: SIZE,
                }}
                className="relative"
              >
                <div
                  onClick={() => ref.current?.click()}
                  className="rounded-full absolute inset-0 bg-black opacity-0 hover:opacity-40 transition-opacity duration-75 flex justify-center items-center"
                >
                  <Icon icon="edit" size={SIZE / 4} />
                </div>
                {/* /profile-image-15647b3b-3b4d-4614-98c9-f4fc8d165cdb.jpeg */}
                <input
                  onChange={onImgUpload}
                  ref={ref}
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                />

                <Suspense>
                  {profileStore.user.profileFullImagePath ? (
                    <img
                      src={profileStore.user.profileFullImagePath}
                      alt="no profile img"
                      className="rounded-full h-full w-full object-fill border border-solid border-gray-500 border-opacity-50"
                    />
                  ) : (
                    <DefaultLogo
                      gender={profileStore.user.gender}
                      className="rounded-full h-full w-full object-fill border border-solid border-gray-500 border-opacity-50"
                    />
                  )}
                </Suspense>
              </div>
            </div>

            <H3
              className="text-center mb-5"
              style={{ marginTop: SIZE / 2, letterSpacing: 1.5 }}
              onClick={() => copy(profileStore.user.userName)}
            >
              {profileStore.user.userName}
            </H3>

            <H5
              className="font-extralight flex justify-between"
              onClick={() => copy(profileStore.user.email)}
            >
              email: <strong>{profileStore.user.email}</strong>
            </H5>
            <H5
              className="font-extralight flex justify-between"
              onClick={() => copy(moment(profileStore.user.birthDate).calendar())}
            >
              birthDate: <strong>{moment(profileStore.user.birthDate).calendar()}</strong>
            </H5>
            <H5
              className="font-extralight flex justify-between"
              onClick={() => copy(profileStore.user.gender)}
            >
              gender: <strong>{profileStore.user.gender}</strong>
            </H5>
            <H5
              className="font-extralight flex justify-between"
              onClick={() => copy(moment(profileStore.user.createdAt).fromNow())}
            >
              created: <strong>{moment(profileStore.user.createdAt).fromNow()}</strong>
            </H5>
            <H5
              className="font-extralight flex justify-between"
              onClick={() => copy(moment(profileStore.user.createdAt).calendar())}
            >
              created date: <strong>{moment(profileStore.user.createdAt).calendar()}</strong>
            </H5>

            <div className="flex justify-end mt-10">
              <Button
                className="ml-auto"
                outlined
                rightIcon="log-out"
                intent="primary"
                text="Sign out"
                onClick={WebSignOut}
              />
            </div>
          </Card>

          <Card
            interactive={true}
            elevation={Elevation.ZERO}
            className="ml-10 flex-[2] !shadow-none min-w-80"
          >
            <ControlGroup fill vertical>
              <br />
              <FormGroup label="Username">
                <InputGroup
                  intent={form.errors.userName && showErrorMessage ? Intent.DANGER : Intent.NONE}
                  placeholder="Enter username"
                  name={formFields.userName}
                  value={form.values.userName}
                  onChange={form.handleChange}
                />
                {showErrorMessage && <FormErrorMessage message={form.errors.userName} />}
              </FormGroup>

              <br />
              <FormGroup label="Gender">
                <HTMLSelect
                  options={['Enter gender please', ...Object.values(Gender)]}
                  className={form.errors.gender && showErrorMessage ? 'danger-select' : ''}
                  fill
                  name={formFields.gender}
                  value={form.values.gender}
                  onChange={form.handleChange}
                />
                {showErrorMessage && <FormErrorMessage message={form.errors.gender} />}
              </FormGroup>

              <br />
              <FormGroup label="Birthdate">
                <DateInput3
                  className={form.errors.birthDate && showErrorMessage ? 'bp5-intent-danger' : ''}
                  placeholder="Enter birthdate"
                  value={form.values.birthDate}
                  onChange={value => form.setFieldValue(formFields.birthDate, value)}
                  dateFnsFormat="dd/MM/yyyy"
                  showActionsBar
                  minDate={moment().subtract(100, 'year').toDate()}
                  maxDate={moment().toDate()}
                  highlightCurrentDay
                  closeOnSelection={false}
                  locale={navigator.language}
                  popoverProps={{ placement: 'bottom' }}
                  rightElement={
                    <Icon icon="globe" intent="primary" style={{ padding: '7px 5px' }} />
                  }
                />
                {showErrorMessage && <FormErrorMessage message={form.errors.birthDate} />}
              </FormGroup>
            </ControlGroup>

            <div className="flex justify-end mt-10">
              <Button
                className="ml-auto"
                outlined
                intent="primary"
                text="Update"
                onClick={() => {
                  setShowErrorMessage(true);
                  form.submitForm();
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
});
