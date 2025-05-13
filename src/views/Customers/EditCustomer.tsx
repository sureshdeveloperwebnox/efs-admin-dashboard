'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import MainCard from 'components/MainCard';
import PhoneInputField from 'components/phone/PhoneInputField';
import Grid from '@mui/material/Grid';
import { GetAllCompanyService, GetCustomerService, UpdateCustomerService } from 'api/services';
import { isValidEmail } from 'utils/check.isvalid.email';
import Autocomplete from '@mui/material/Autocomplete';

// model
type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  job_title: string;
  address: string;
  password: string;
  company_id: number;
  users?: {
    id: number;
  };
};

interface Company {
  id: string;
  name: string;
}

export default function EditCustomer() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [editCust, setEditedCust] = useState<Customer | null>(null);
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    address: '',
    password: '',
    company_id: ''
  });

  // Get Company name
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await GetAllCompanyService();
        const companies: Company[] = Array.isArray(response) ? response : [];
        setCompanyData(companies);
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        setCompanyData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        try {
          const data = await GetCustomerService(id);
          setEditedCust(data);
          setFormData({
            id: data?.id,
            user_id: data?.users?.id || 0,
            first_name: data?.first_name || '',
            last_name: data?.last_name || '',
            email: data?.email || '',
            phone: data?.phone || '',
            job_title: data?.users?.job_title || '',
            address: data?.address || '',
            password: data?.password || '',
            company_id: data?.company_id || ''
          });

          // Set selected company if company_id exists
          if (data?.company_id) {
            const companies = await GetAllCompanyService();
            const company = companies.find((c: Company) => c.id === data.company_id.toString());
            if (company) setSelectedCompany(company);
          }
        } catch (err) {
          console.error('Failed to fetch customer:', err);
        }
      };
      fetchCustomer();
    }
  }, [id]);

  const handleCompanyChange = (event: any, newValue: Company | null) => {
    setSelectedCompany(newValue);
    setFormData((prev) => ({
      ...prev,
      company_id: newValue?.id || ''
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

  const handleSave = async () => {
    if (!editCust) return;

    // Validate required fields
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.company_id) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedCust = { ...formData };
      const result = await UpdateCustomerService(updatedCust);
      if (result?.data) {
        router.back();
      }
    } catch (error) {
      console.error('Failed to update customer:', error);
      alert('Failed to update customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!editCust) {
    return <Box sx={{ padding: 2 }}>Loading customer data...</Box>;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard title="Edit Customer">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              options={companyData}
              getOptionLabel={(option) => option.name}
              value={selectedCompany}
              onChange={handleCompanyChange}
              loading={isLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Company"
                  placeholder="Select a company"
                  required
                  error={!formData.company_id}
                  helperText={!formData.company_id ? 'Company is required' : ''}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="first_name"
              label="First Name"
              value={formData.first_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              name="last_name"
              label="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              fullWidth
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              type="email"
              required
              error={!isValidEmail(formData.email) && formData.email !== ''}
              helperText={!isValidEmail(formData.email) && formData.email !== '' ? 'Please enter a valid email address' : ''}
            />
          </Grid>

          <Grid item xs={12}>
            <PhoneInputField
              label="Phone Number"
              value={formData.phone}
              onChange={(value) => handleChange({ target: { name: 'phone', value } } as any)}
              defaultCountry="IN"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="outlined-required"
              name="job_title"
              label="Job Title"
              value={formData.job_title}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>

          <Grid item xs={12}>
            <Stack direction="row" spacing={2} mt={2}>
              <Button variant="contained" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleBack} disabled={isSubmitting}>
                Back
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
}
