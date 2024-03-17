/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client' // for using forms
import React, { useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type * as z from 'zod' // using shadcn
import { usePathname, useRouter } from 'next/navigation'
import { ThreadValidation } from '@/lib/validations/thread'
//import { updateUser } from '@/lib/actions/user.actions'
import { createThread } from '@/lib/actions/thread.actions'

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
import { Textarea } from '../ui/textarea'


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

  
function PostThread({ userId} : {userId: string}){
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: userId,
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
      console.log("creating thread.."+values.thread);
      await createThread({ 
        text: values.thread,
        author: userId,
        communityId: null,
        path: pathname
      })

      router.push("/")
    }

    return (
        <Form {...form}>
        <form
         className="mt-10 flex flex-col justify-start gap-10"
         onSubmit={form.handleSubmit(onSubmit)}
        >
             <FormField
             control={form.control}
             name="thread"
             render={({ field }) => (
               <FormItem className="flex flex-col w-full gap-3">
                 <FormLabel className='text-base-semibold text-light-2'>
                  Content
                  </FormLabel>
                 <FormControl className="no-focus border 
                 border-dark-4 bg-dark-3 text-light-1">
                  <Textarea
                    rows={15}
                    {...field}
                    />
                 </FormControl>
                 <FormItem />
               </FormItem>
             )}
           />

          <Button type="submit" className="bg-primary-500">
            Post thread
          </Button>
        </form>
        </Form>
    )
}

export default PostThread;