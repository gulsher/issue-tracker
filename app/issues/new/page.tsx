'use client';
import {  TextField ,Button, Callout, Text} from '@radix-ui/themes'
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { useForm , Controller} from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/ValidationSchemas';
import { z } from 'zod';
import ErrrorMessage from '@/app/components/ErrrorMessage';
import Spinner from '@/app/components/Spinner';
type IssueForm = z.infer<typeof createIssueSchema>

const NewIssuePage = () => {
    const router = useRouter();
   const {register,control, handleSubmit, formState:{errors}} = useForm<IssueForm>({
    resolver:zodResolver(createIssueSchema)
   });
   const [error,setError] = useState('');
   const [isLoading,setLoading] = useState(false);
   
   const handleSubmiting = handleSubmit(async (data)=>{
    try {
        setLoading(true)
        await axios.post('/api/issues',data);
    router.push("/issues");
    } catch (error) {
        console.log(error);
        setLoading(false)
        setError('An unexpected error occurred')
    }
    
})

  return (
    <div className='max-w-xl'>
    {error && <Callout.Root color='red' className='mb-5'>
        <Callout.Text>{error}</Callout.Text>
        </Callout.Root>}
    <form className=' space-y-3' onSubmit={handleSubmiting}>
        <TextField.Root>
            <TextField.Input placeholder='title' {...register('title')} />
        </TextField.Root>
        {errors.title && <ErrrorMessage>{errors.title.message}</ErrrorMessage>}
        <Controller name='description' control={control} render={({field})=>  <SimpleMDE placeholder='description' {...field} />} />
        {errors.description && <ErrrorMessage>{errors.description.message}</ErrrorMessage>}

        <Button disabled={isLoading} > Submit New Issue {isLoading && <Spinner />} </Button>
    </form>
    </div>
  )
}

export default NewIssuePage