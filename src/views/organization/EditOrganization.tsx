'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import MainCard from 'components/MainCard';
import { GetOrganizationService, UpdateOrganizationService } from 'api/services/OrganizationService';

type Organization = {
  id: string;
  name: string;
  description: string;
  website: string;
  email: string;
};

export default function EditOrganizationPage() {
  const { id } = useParams();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [editedOrg, setEditedOrg] = useState<Organization | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      GetOrganizationService(id as number).then((data) => {
        setOrganization(data);
        setEditedOrg(data);
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!editedOrg) return;
    setEditedOrg({ ...editedOrg, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (!editedOrg) return;
      await UpdateOrganizationService(editedOrg);
      setOrganization(editedOrg);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update organization:', error);
    }
  };

  const handleEditClick = () => {
    if (organization) {
      setEditedOrg(organization);
      setEditing(true);
    }
  };

  const handleCancel = () => {
    if (organization) {
      setEditedOrg(organization);
      setEditing(false);
    }
  };

  if (!editedOrg) return <div>Loading...</div>;

  return (
    <MainCard title="Edit Organization">
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

      <Stack direction="row" spacing={2} mt={2}>
        {!editing ? (
          <Button variant="contained" onClick={handleEditClick}>
            Edit
          </Button>
        ) : (
          <>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        )}
        <Button variant="text">Close</Button>
      </Stack>
    </MainCard>
  );
}
