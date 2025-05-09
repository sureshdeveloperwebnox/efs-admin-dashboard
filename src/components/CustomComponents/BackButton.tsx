'use client';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();

  return (
    <IconButton onClick={() => router.back()}>
      <MdArrowBack size={'35px'} color='black' />
    </IconButton>
  );
};

export default BackButton;
