'use client';

import { useState } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MainCard from 'components/MainCard';
type Organization = {
  name: string;
  description: string;
  website: string;
  email: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  organization: Organization;
  onSave: (updatedOrg: Organization) => void;
};

export default function EditOrganizationDialog(rows: any) {

  console.log("rows", rows);
  
  const [editing, setEditing] = useState(false);
  const [editedOrg, setEditedOrg] = useState<Organization>(rows);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedOrg((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <MainCard>
      <TextField
        name="name"
        label="Organization Name"
        value={editedOrg.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={!editing}
      />
      <TextField
        name="description"
        label="Description"
        value={editedOrg.description}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        disabled={!editing}
      />
      <TextField
        name="website"
        label="Website"
        value={editedOrg.website}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={!editing}
      />
      <TextField
        name="email"
        label="Contact Email"
        value={editedOrg.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        disabled={!editing}
      />
    </MainCard>
  );
}
