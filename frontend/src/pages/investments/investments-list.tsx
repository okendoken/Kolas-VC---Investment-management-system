import { mdiChartTimelineVariant } from '@mdi/js';
import Head from 'next/head';
import { uniqueId } from 'lodash';
import React, { ReactElement, useState } from 'react';
import CardBox from '../../components/CardBox';
import LayoutAuthenticated from '../../layouts/Authenticated';
import SectionMain from '../../components/SectionMain';
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton';
import { getPageTitle } from '../../config';
import TableInvestments from '../../components/Investments/TableInvestments';
import BaseButton from '../../components/BaseButton';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../stores/hooks';
import CardBoxModal from '../../components/CardBoxModal';
import DragDropFilePicker from '../../components/DragDropFilePicker';
import {
  setRefetch,
  uploadCsv,
} from '../../stores/investments/investmentsSlice';

import { hasPermission } from '../../helpers/userPermissions';

const InvestmentsTablesPage = () => {
  const [filterItems, setFilterItems] = useState([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);

  const { currentUser } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const [filters] = useState([
    { label: 'InvestmentAmount', title: 'amount', number: 'true' },
    { label: 'InvestmentDate', title: 'date', date: 'true' },
    { label: 'Startup', title: 'startup' },
    { label: 'Investor', title: 'investor' },
  ]);

  const hasCreatePermission =
    currentUser && hasPermission(currentUser, 'CREATE_INVESTMENTS');

  const addFilter = () => {
    const newItem = {
      id: uniqueId(),
      fields: {
        filterValue: '',
        filterValueFrom: '',
        filterValueTo: '',
        selectedField: '',
      },
    };
    newItem.fields.selectedField = filters[0].title;
    setFilterItems([...filterItems, newItem]);
  };

  const getInvestmentsCSV = async () => {
    const response = await axios({
      url: '/investments?filetype=csv',
      method: 'GET',
      responseType: 'blob',
    });
    const type = response.headers['content-type'];
    const blob = new Blob([response.data], { type: type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'investmentsCSV.csv';
    link.click();
  };

  const onModalConfirm = async () => {
    if (!csvFile) return;
    await dispatch(uploadCsv(csvFile));
    dispatch(setRefetch(true));
    setCsvFile(null);
    setIsModalActive(false);
  };

  const onModalCancel = () => {
    setCsvFile(null);
    setIsModalActive(false);
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Investments')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiChartTimelineVariant}
          title='Investments'
          main
        >
          {''}
        </SectionTitleLineWithButton>
        <CardBox className='mb-6'>
          {hasCreatePermission && (
            <BaseButton
              className={'mr-3'}
              href={'/investments/investments-new'}
              color='info'
              label='New Item'
            />
          )}

          <BaseButton
            className={'mr-3'}
            color='info'
            label='Filter'
            onClick={addFilter}
          />
          <BaseButton
            className={'mr-3'}
            color='info'
            label='Download CSV'
            onClick={getInvestmentsCSV}
          />

          {hasCreatePermission && (
            <BaseButton
              color='info'
              label='Upload CSV'
              onClick={() => setIsModalActive(true)}
            />
          )}
        </CardBox>
        <CardBox className='mb-6' hasTable>
          <TableInvestments
            filterItems={filterItems}
            setFilterItems={setFilterItems}
            filters={filters}
          />
        </CardBox>
      </SectionMain>
      <CardBoxModal
        title='Upload CSV'
        buttonColor='info'
        buttonLabel={'Confirm'}
        // buttonLabel={false ? 'Deleting...' : 'Confirm'}
        isActive={isModalActive}
        onConfirm={onModalConfirm}
        onCancel={onModalCancel}
      >
        <DragDropFilePicker
          file={csvFile}
          setFile={setCsvFile}
          formats={'.csv'}
        />
      </CardBoxModal>
    </>
  );
};

InvestmentsTablesPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutAuthenticated permission={'READ_INVESTMENTS'}>
      {page}
    </LayoutAuthenticated>
  );
};

export default InvestmentsTablesPage;
