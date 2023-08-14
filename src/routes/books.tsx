import {
  ControlGroup,
  FormGroup,
  InputGroup,
  Classes,
  Button,
  Text,
  Intent,
  H5,
  Popover,
} from '@blueprintjs/core';
import { useFormik } from 'formik';
import { JSX } from 'react';
import { fields } from '../helper';
import { bookActions, bookBuilder, booksSelect } from '../store/books/books.slice';
import { useDispatch, useSelector } from 'react-redux';
import { Table2, Column, Cell, ColumnHeaderCell, SelectionModes } from '@blueprintjs/table';
import * as Yup from 'yup';

const BookSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('Required'),
  price: Yup.number()
    .typeError('Invalid number')
    .positive('Must be number and more than 0')
    .required('Required'),
});

const FormErrorMessage = ({ message }: { message: string | undefined }) => {
  if (!message) {
    return <></>;
  }

  return (
    <>
      <Text style={{ color: 'red' }}>{message}</Text>
    </>
  );
};

const PopoverConfirm = (params: { onSuccessClick: () => void }) => {
  return (
    <div key="text">
      <H5>Confirm deletion</H5>
      <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
        <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button
          intent={Intent.DANGER}
          className={Classes.POPOVER_DISMISS}
          onClick={params.onSuccessClick}
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

const PopConfirm = (params: { onSuccessClick: () => void }) => {
  return (
    <Popover
      popoverClassName={Classes.POPOVER_CONTENT_SIZING}
      portalClassName="foo"
      enforceFocus={false}
      content={<PopoverConfirm onSuccessClick={params.onSuccessClick} />}
    >
      <Button intent={Intent.DANGER} tabIndex={0} small icon="delete" />
    </Popover>
  );
};

export const Books = (): JSX.Element => {
  const books = useSelector(booksSelect);
  const dispatch = useDispatch();
  // const booksLoaderData = useLoaderData() as { books: Book[] };

  const booksForm = useFormik({
    initialValues: {
      name: '',
      price: '',
    },
    validateOnChange: false,
    validationSchema: BookSchema,
    onSubmit: (values, { resetForm }) => {
      const newBook = bookBuilder(values);
      const addBookPayload = bookActions.add(newBook);

      dispatch(addBookPayload);
      resetForm();
    },
  });
  const booksFormFields = fields<(typeof booksForm)['initialValues']>();

  const ColumnHeader = (index: number) => {
    const name = [booksFormFields.name, booksFormFields.price][index];
    return (
      <ColumnHeaderCell
        name={name}
        index={index}
        nameRenderer={(name, _index) => (
          <div style={{ lineHeight: '24px' }}>
            <div className={Classes.TEXT_LARGE}>
              <strong>{name}</strong>
            </div>
          </div>
        )}
      />
    );
  };

  // useEffect(() => {
  //   const setBooksPayload = bookActions.set(booksLoaderData.books);
  //   dispatch(setBooksPayload);
  // }, [booksLoaderData.books, dispatch]);

  return (
    <>
      <ControlGroup fill={true} vertical={true} style={{ width: '500px' }}>
        <h1>Create Book</h1>
        <br />

        <FormGroup label="Name" labelInfo="(required)">
          <InputGroup
            placeholder="Enter name"
            name={booksFormFields.name}
            value={booksForm.values.name}
            onChange={booksForm.handleChange}
          />
          <FormErrorMessage message={booksForm.errors.name} />
        </FormGroup>

        <br />
        <FormGroup label="Price" labelInfo="(required)">
          <InputGroup
            name={booksFormFields.price}
            placeholder="Enter price"
            value={booksForm.values.price}
            onChange={booksForm.handleChange}
          />
          <FormErrorMessage message={booksForm.errors.price} />
        </FormGroup>

        <br />
        <div className={Classes.FOCUS_STYLE_MANAGER_IGNORE}>
          <Button rightIcon="add" text="Add" onClick={booksForm.submitForm} />
        </div>
      </ControlGroup>

      <br />
      <br />

      <div style={{ height: '400px' }}>
        <Table2
          numRows={books.length}
          enableGhostCells={true}
          enableFocusedCell={false}
          minRowHeight={100}
          defaultRowHeight={40}
          selectionModes={SelectionModes.NONE}
        >
          <Column
            cellRenderer={rowIndex => <Cell>{books[rowIndex]?.name ?? ''}</Cell>}
            columnHeaderCellRenderer={ColumnHeader}
          />
          <Column
            cellRenderer={rowIndex => <Cell>{books[rowIndex]?.price ?? ''}</Cell>}
            columnHeaderCellRenderer={ColumnHeader}
          />
          <Column
            cellRenderer={rowIndex => (
              <Cell intent={Intent.NONE} tooltip={'asdasd'}>
                <PopConfirm
                  onSuccessClick={() => {
                    const deleteBookPayload = bookActions.delete(rowIndex);
                    dispatch(deleteBookPayload);
                  }}
                />
              </Cell>
            )}
            columnHeaderCellRenderer={index => (
              <ColumnHeaderCell
                name="Action"
                index={index}
                nameRenderer={(name, _index) => (
                  <div style={{ lineHeight: '24px' }}>
                    <div className={Classes.TEXT_LARGE}>
                      <strong>{name}</strong>
                    </div>
                  </div>
                )}
              />
            )}
          />
        </Table2>
      </div>
    </>
  );
};
