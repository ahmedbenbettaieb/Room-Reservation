import React from 'react';
import { useAppDispatch, useAppSelector } from '@/pages/redux/store';
import { createUser } from '@/pages/redux/allUsers/allUsersSlice';
import { Button, TextInput, Loader, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications'; // Import Mantine's notification system

interface CreateUserProps {
  closeModal: () => void;
}

export default function CreateUser({ closeModal }: CreateUserProps) {
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector((state) => state.allUsers);

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      role: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email') && (value ? null : 'Email is required'),
      name: (value) => (value ? null : 'Name is required'),
      role: (value) => (value ? null : 'Role is required'),
    },
  });

  const handleSubmit = async (formData: any) => {
    try {
      await dispatch(createUser(formData));
    
      
      showNotification({
        title: 'User Created',
        message: 'User created successfully!',
        color: 'green',
        position: 'top-right',
        autoClose: 4000,
        
      });

      closeModal();
    } catch (error: any) {
      showNotification({
        title: 'Error',
        message: `Error: ${error.message || 'Something went wrong'}`,
        color: 'red',
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  return (
    <div>
      <h1>Create User</h1>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Name"
          name="name"
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          {...form.getInputProps('email')}
        />
        <Select
          label="Role"
          name="role"
          required
          data={['user', 'admin', 'superUser']}
          {...form.getInputProps('role')}
        />
        <Button style={{ marginTop: '1rem' }} type="submit">
          {loading ? <Loader size="sm" /> : 'Create User'}
        </Button>
      </form>
    </div>
  );
}
