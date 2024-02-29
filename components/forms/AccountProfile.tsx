/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client' // for using forms
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/validations/user'
import Image from 'next/image'
import type * as z from 'zod' // using shadcn

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface Props {
  user: {
    id: string | ''
    objectId: string
    username: string
    name: string
    bio: string
    image: string
  }
  btnTitle: string
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: '',
      name: '',
      username: '',
      bio: ''
    }
  })

  function onSubmit (values: z.infer<typeof UserValidation>) {
    console.log(values)
  }

  return (
       <Form {...form}>
         <form
          className="flex flex-col justify-start gap-10"
          onSubmit={form.handleSubmit(onSubmit)}
         >
           <FormField
             control={form.control}
             name="profile_photo"
             render={({ field }) => (
               <FormItem className="flex items-center gap-4">
                 <FormLabel className='account-form_image-label'>
                  {(field.value.length > 0)
                    ? (
                    <Image
                      src={field.value}
                      alt="profile photo"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain"
                    />
                      )
                    : (
                    <Image
                      src="/assets/profile.svg"
                      alt="profile photo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                      )}
                  </FormLabel>
                 <FormControl>
                   <Input placeholder="your username" {...field} />
                 </FormControl>
                 <FormDescription>
                   This is your public display name.
                 </FormDescription>
                 <FormMessage />
               </FormItem>
             )}
           />
          <Button type="submit">Submit</Button>
         </form>
       </Form>
  )
}

export default AccountProfile
