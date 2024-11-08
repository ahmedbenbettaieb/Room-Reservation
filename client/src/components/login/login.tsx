import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { Button, Group, TextInput,Modal } from '@mantine/core';
import axiosInstance from '@/config/AxiosInstance';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { useLogin } from '@/hooks/useLogin';


export default function login(values: any) {

    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);
    const { login, loading, error } = useLogin();

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
          email: '',
          password: '',
          termsOfService: false,
        },
    
        validate: {
          email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
      });

      const onSubmit = async (values: any) => {
        await login(values);
        if (!error) navigate('/');
      };

  return (
    <div>
      <form onSubmit={form.onSubmit((values) => onSubmit(values))}>
      <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <TextInput
        withAsterisk
        label="Password"
        placeholder="password"
        key={form.key('password')}
        {...form.getInputProps('password')}
      />
      

      <Group justify="flex-end" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
    <Modal
        opened={opened}
        onClose={close}
        title="Invalid Credentials"
        size="lg"
      >
      </Modal>
    </div>


 
  )
}
