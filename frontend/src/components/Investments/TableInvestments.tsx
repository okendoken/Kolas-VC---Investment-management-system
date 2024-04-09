import React, { useEffect, useState, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import BaseButton from '../BaseButton';
import CardBoxModal from '../CardBoxModal';
import CardBox from '../CardBox';
import {
  fetch,
  update,
  deleteItem,
  setRefetch,
} from '../../stores/investments/investmentsSlice';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import { useRouter } from 'next/router';
import { Field, Form, Formik } from 'formik';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { loadColumns } from './configureInvestmentsCols';
import _ from 'lodash';
import dataFormatter from '../../helpers/dataFormatter';
import { dataGridStyles } from '../../styles';

import ListInvestments from './ListInvestments';

const perPage = 10;

const TableSampleInvestments = ({ filterItems, setFilterItems, filters }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const notify = (type, msg) => toast(msg, { type, position: 'bottom-center' });

  const pagesList = [];
  const [id, setId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterRequest, setFilterRequest] = React.useState('');
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [sortModel, setSortModel] = useState([
    {
      field: '',
      sort: 'desc',
    },
  ]);
  const {
    investments,
    loading,
    count,
    notify: investmentsNotify,
    refetch,
  } = useAppSelector((state) => state.investments);
  const { currentUser } = useAppSelector((state) => state.auth);

  const organizationId = currentUser?.organization?.id;

  const numPages =
    Math.floor(count / perPage) === 0 ? 1 : Math.ceil(count / perPage);
  for (let i = 0; i < numPages; i++) {
    pagesList.push(i);
  }

  const loadData = async (page = currentPage, request = filterRequest) => {
    if (page !== currentPage) setCurrentPage(page);
    if (request !== filterRequest) setFilterRequest(request);
    const { sort, field } = sortModel[0];

    const query = `?organization=${organizationId}&page=${page}&limit=${perPage}${request}&sort=${sort}&field=${field}`;
    dispatch(fetch({ limit: perPage, page, query }));
  };

  useEffect(() => {
    if (investmentsNotify.showNotification) {
      notify(
        investmentsNotify.typeNotification,
        investmentsNotify.textNotification,
      );
    }
  }, [investmentsNotify.showNotification]);

  useEffect(() => {
    loadData();
  }, [dispatch, sortModel]);

  useEffect(() => {
    if (refetch) {
      loadData(0);
      dispatch(setRefetch(false));
    }
  }, [refetch, dispatch]);

  const [isModalInfoActive, setIsModalInfoActive] = useState(false);
  const [isModalTrashActive, setIsModalTrashActive] = useState(false);

  const handleModalAction = () => {
    setIsModalInfoActive(false);
    setIsModalTrashActive(false);
  };

  const handleEditAction = (id: string) => {
    router.push(`/investments/${id}`);
  };

  const handleViewAction = (id: string) => {
    router.push(`/investments/investments-view/?id=${id}`);
  };

  const handleDeleteModalAction = (id: string) => {
    setId(id);
    setIsModalTrashActive(true);
  };
  const handleDeleteAction = async () => {
    if (id) {
      await dispatch(deleteItem(id));
      await loadData(0);
      setIsModalTrashActive(false);
    }
  };

  const generateFilterRequests = useMemo(() => {
    let request = '&';
    filterItems.forEach((item) => {
      filters.find(
        (filter) =>
          filter.title === item.fields.selectedField &&
          (filter.number || filter.date),
      )
        ? (request += `${item.fields.selectedField}Range=${item.fields.filterValueFrom}&${item.fields.selectedField}Range=${item.fields.filterValueTo}&`)
        : (request += `${item.fields.selectedField}=${item.fields.filterValue}&`);
    });
    return request;
  }, [filterItems, filters]);

  const deleteFilter = (value) => {
    const newItems = filterItems.filter((item) => item.id !== value);

    if (newItems.length) {
      setFilterItems(newItems);
    } else {
      loadData(0, '');
      setFilterItems(newItems);
    }
  };

  const handleSubmit = () => {
    loadData(0, generateFilterRequests);
  };

  const handleChange = (id) => (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFilterItems(
      filterItems.map((item) =>
        item.id === id
          ? { id, fields: { ...item.fields, [name]: value } }
          : item,
      ),
    );
  };

  const handleReset = () => {
    setFilterItems([]);
    loadData(0, '');
  };

  const onPageChange = (page: number) => {
    loadData(page);
    setCurrentPage(page);
  };

  useEffect(() => {
    if (!currentUser) return;

    loadColumns(
      handleDeleteModalAction,
      handleViewAction,
      handleEditAction,
      `investments`,
      currentUser,
    ).then((newCols) => setColumns(newCols));
  }, [currentUser]);

  const handleTableSubmit = async (id: string, data) => {
    if (!_.isEmpty(data)) {
      await dispatch(update({ id, data }))
        .unwrap()
        .then((res) => res)
        .catch((err) => {
          throw new Error(err);
        });
    }
  };

  const controlClasses =
    'w-full py-2 px-2 my-2 border-gray-700 rounded dark:placeholder-gray-400 ' +
    'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none bg-white ' +
    'dark:bg-slate-800 border';

  return (
    <>
      {filterItems && Array.isArray(filterItems) && filterItems.length ? (
        <CardBox>
          <Formik
            initialValues={{
              checkboxes: ['lorem'],
              switches: ['lorem'],
              radio: 'lorem',
            }}
            onSubmit={() => null}
          >
            <Form>
              <>
                {filterItems &&
                  filterItems.map((filterItem) => {
                    return (
                      <div key={filterItem.id} className='flex mb-4'>
                        <div className='flex flex-col w-full mr-3'>
                          <div className='text-gray-500 font-bold'>Filter</div>
                          <Field
                            className={controlClasses}
                            name='selectedField'
                            id='selectedField'
                            component='select'
                            value={filterItem?.fields?.selectedField}
                            onChange={handleChange(filterItem.id)}
                          >
                            {filters.map((selectOption) => (
                              <option
                                key={selectOption.title}
                                value={`${selectOption.title}`}
                              >
                                {selectOption.label}
                              </option>
                            ))}
                          </Field>
                        </div>
                        {filters.find(
                          (filter) =>
                            filter.title === filterItem?.fields?.selectedField,
                        )?.number ? (
                          <div className='flex flex-row w-full mr-3'>
                            <div className='flex flex-col w-full mr-3'>
                              <div className='text-gray-500 font-bold'>
                                From
                              </div>
                              <Field
                                className={controlClasses}
                                name='filterValueFrom'
                                placeholder='From'
                                id='filterValueFrom'
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                            <div className='flex flex-col w-full'>
                              <div className='text-gray-500 font-bold'>To</div>
                              <Field
                                className={controlClasses}
                                name='filterValueTo'
                                placeholder='to'
                                id='filterValueTo'
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                          </div>
                        ) : filters.find(
                            (filter) =>
                              filter.title ===
                              filterItem?.fields?.selectedField,
                          )?.date ? (
                          <div className='flex flex-row w-full mr-3'>
                            <div className='flex flex-col w-full mr-3'>
                              <div className='text-gray-500 font-bold'>
                                From
                              </div>
                              <Field
                                className={controlClasses}
                                name='filterValueFrom'
                                placeholder='From'
                                id='filterValueFrom'
                                type='datetime-local'
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                            <div className='flex flex-col w-full'>
                              <div className='text-gray-500 font-bold'>To</div>
                              <Field
                                className={controlClasses}
                                name='filterValueTo'
                                placeholder='to'
                                id='filterValueTo'
                                type='datetime-local'
                                onChange={handleChange(filterItem.id)}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className='flex flex-col w-full mr-3'>
                            <div className='text-gray-500 font-bold'>
                              Contains
                            </div>
                            <Field
                              className={controlClasses}
                              name='filterValue'
                              placeholder='Contained'
                              id='filterValue'
                              onChange={handleChange(filterItem.id)}
                            />
                          </div>
                        )}
                        <div className='flex flex-col'>
                          <div className='text-gray-500 font-bold'>Action</div>
                          <BaseButton
                            className='my-2'
                            type='reset'
                            color='danger'
                            label='Delete'
                            onClick={() => {
                              deleteFilter(filterItem.id);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                <div className='flex'>
                  <BaseButton
                    className='my-2 mr-3'
                    color='success'
                    label='Apply'
                    onClick={handleSubmit}
                  />
                  <BaseButton
                    className='my-2'
                    color='info'
                    label='Cancel'
                    onClick={handleReset}
                  />
                </div>
              </>
            </Form>
          </Formik>
        </CardBox>
      ) : null}
      <CardBoxModal
        title='Please confirm'
        buttonColor='info'
        buttonLabel={loading ? 'Deleting...' : 'Confirm'}
        isActive={isModalTrashActive}
        onConfirm={handleDeleteAction}
        onCancel={handleModalAction}
      >
        <p>Are you sure you want to delete this item?</p>
      </CardBoxModal>

      {investments && Array.isArray(investments) && (
        <ListInvestments
          investments={investments}
          loading={loading}
          onView={handleViewAction}
          onEdit={handleEditAction}
          onDelete={handleDeleteModalAction}
          currentPage={currentPage}
          numPages={numPages}
          onPageChange={onPageChange}
        />
      )}

      <ToastContainer />
    </>
  );
};

export default TableSampleInvestments;
