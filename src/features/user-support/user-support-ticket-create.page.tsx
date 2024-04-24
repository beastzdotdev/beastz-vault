import {
  Button,
  Callout,
  Classes,
  ControlGroup,
  FormGroup,
  H2,
  InputGroup,
  Intent,
  TextArea,
} from '@blueprintjs/core';
import { useState } from 'react';
import { useFormik } from 'formik';
import { useInjection } from 'inversify-react';
import { useNavigate } from 'react-router-dom';
import { FormErrorMessage } from '../../components/form-error-message';
import { UserSupportCreateTicketFieldsSchema } from './validation/user-support-ticket-create-validation-schema';
import { fields, zodFormikErrorAdapter } from '../../shared/helper';
import { UserSupportController } from './state/user-support.controller';
import { constants } from '../../shared/constants';

export const UserSupportTicketCreatePage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const userSupportController = useInjection(UserSupportController);

  const form = useFormik({
    initialValues: {
      description: '',
      title: '',
    },
    validateOnChange: true,
    validationSchema: zodFormikErrorAdapter(UserSupportCreateTicketFieldsSchema),
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      await userSupportController.createTicket(values, {
        successCallback(value) {
          // navigate to detail
          navigate(constants.path.support + `/${value.id}`);
        },
      });
    },
  });

  const formFields = fields<(typeof form)['initialValues']>();
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  return (
    <div className="mx-2.5 mt-3 cursor-default">
      <div className="flex">
        <div className="flex items-center mr-2">
          <Button icon="chevron-left" minimal onClick={() => navigate(constants.path.support)} />
        </div>
        <H2 className="font-extralight mb-1">Ticket create</H2>
      </div>

      <ControlGroup fill vertical style={{ width: '500px' }} className="mt-10">
        <FormGroup label="Title" labelInfo="(required)">
          <InputGroup
            intent={form.errors.title && showErrorMessage ? Intent.DANGER : Intent.NONE}
            placeholder="Enter title"
            name={formFields.title}
            value={form.values.title}
            onChange={form.handleChange}
          />
          {showErrorMessage && <FormErrorMessage message={form.errors.title} />}
        </FormGroup>

        <FormGroup label="Description" labelInfo="(required)" className="mt-5">
          <TextArea
            fill
            intent={form.errors.description && showErrorMessage ? Intent.DANGER : Intent.NONE}
            placeholder="Enter description"
            name={formFields.description}
            value={form.values.description}
            onChange={form.handleChange}
            autoResize
            className="!resize-none hover:!resize-y max-h-52 min-h-24"
          />
          {showErrorMessage && <FormErrorMessage message={form.errors.description} />}
        </FormGroup>

        <br />

        <Callout compact intent={Intent.PRIMARY} icon="info-sign">
          If you want to upload image create ticket and upload image as reply
        </Callout>

        <div className={`${Classes.FOCUS_STYLE_MANAGER_IGNORE} mt-3`}>
          <Button
            icon="add"
            intent="primary"
            text="Create"
            onClick={() => {
              setShowErrorMessage(true);
              form.submitForm();
            }}
          />
        </div>
      </ControlGroup>
    </div>
  );
};
