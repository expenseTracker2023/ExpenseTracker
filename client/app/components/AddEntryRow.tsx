'use client';
import React, { useState, useEffect } from 'react';
import AddEntryRowStyles from '../styles/AddEntryRow.module.scss';

import CategoryPicker from '../atoms/CategoryPicker';
import DatePick from '../atoms/DatePick';

import { motion } from 'framer-motion';
import { useWizard } from 'react-use-wizard';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

interface entryType {
  date: string;
  description: string;
  category: string;
  income?: number;
  debits?: number;
}

export default function AddEntryRow({
  step,
  setStep,
  setEntryArr,
  entryArr,
  setIsAddModalOpen,
}: {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setEntryArr: React.Dispatch<React.SetStateAction<entryType[]>>;
  entryArr: entryType[];
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { previousStep } = useWizard();
  const [entryObj, setEntryObj] = useState<entryType>({
    date: dayjs().format('YYYY-MM-DD'),
    description: '',
    category: '',
    income: 0,
    debits: 0,
  });
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEntryObj({ ...entryObj, description: e.target.value });
  };

  const handleCategoryChange = (category: string) => {
    setEntryObj({ ...entryObj, category: category });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (entryObj.category === 'Income') {
      setEntryObj({ ...entryObj, income: newValue, debits: 0 });
    } else if (entryObj.category !== 'Income') {
      setEntryObj({ ...entryObj, debits: newValue, income: 0 });
    }
  };

  const handleDateChange = (date: string) => {
    setEntryObj({ ...entryObj, date: date });
  };

  const isValidEntry = () => {
    const { category, description, income, debits } = entryObj;
    console.log(description, income, debits);

    if (category === 'income') {
      // Validate for the 'Income' category
      if (description !== '' && income !== 0) {
        setIsDisabled(false); // Return false if description is empty or income is 0
      }
    } else {
      // Validate for other categories
      if (description === '' || debits === 0) {
        setIsDisabled(true); // Return false if description is empty or debits is 0
      }
    }
    // setIsDisabled(true);
  };

  useEffect(() => {
    isValidEntry();
  }, [entryObj]);
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ ease: 'easeOut', duration: 0.5 }}
      className={AddEntryRowStyles.addEntryRow}
    >
      <div className={AddEntryRowStyles.addEntryRow__header}>
        <p>Add a new entry</p>
        <CloseIcon
          className={AddEntryRowStyles.addEntryRow__closeIcon}
          onClick={() => {
            setIsAddModalOpen(false);
            setEntryArr([]);
            setStep(0);
          }}
        ></CloseIcon>
      </div>
      <div className={AddEntryRowStyles.addEntryRow__inputsContainer}>
        <div className={AddEntryRowStyles.addEntryRow__inputRow}>
          <p className={AddEntryRowStyles.addEntryRow__inputsLabel}>
            Description
          </p>
          <input
            type="text"
            placeholder="e.g. ice cream"
            value={entryObj.description}
            onChange={handleDescriptionChange}
            className={AddEntryRowStyles.addEntryRow__descInput}
          ></input>
        </div>

        <div className={AddEntryRowStyles.addEntryRow__inputRow}>
          <p className={AddEntryRowStyles.addEntryRow__inputsLabel}>Category</p>
          <CategoryPicker
            fromModal={true}
            handleCategoryChange={handleCategoryChange}
          />
        </div>

        <div className={AddEntryRowStyles.addEntryRow__inputRow}>
          <p className={AddEntryRowStyles.addEntryRow__inputsLabel}>Amount</p>
          <input
            type="number"
            placeholder="e.g. $2000"
            onChange={handleAmountChange}
            className={AddEntryRowStyles.addEntryRow__amountInput}
          ></input>
        </div>

        <div className={AddEntryRowStyles.addEntryRow__inputRow}>
          <p className={AddEntryRowStyles.addEntryRow__inputsLabel}>Date</p>
          <DatePick handleDateChange={handleDateChange} />
        </div>
      </div>
      <button
        onClick={() => {
          previousStep();
          setStep(1);
        }}
      >
        Back
      </button>
      <button
        onClick={() => {
          previousStep();
          setStep(1);
          setEntryArr([...entryArr, entryObj]);
        }}
        // disabled={isDisabled ? true : false}
      >
        Add Entry
      </button>
    </motion.div>
  );
}