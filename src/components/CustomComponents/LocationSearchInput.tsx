'use client';

import React, { useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  onPlaceSelected: (place: google.maps.places.PlaceResult | null) => void;
};

const LocationSearchInput: React.FC<Props> = ({
  label = 'Search Location',
  value,
  onChange,
  onPlaceSelected
}) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      onPlaceSelected(place);
    }
  };

  return (
    <Box width="100%">
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <TextField
          inputRef={inputRef}
          fullWidth
          label={label}
          variant="outlined"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Autocomplete>
    </Box>
  );
};

export default LocationSearchInput;
