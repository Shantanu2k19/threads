/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client' // for using forms
import React, { useState, type ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'

import type * as z from 'zod' // using shadcn
import { useForm } from 'react-hook-form'

import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'

import Image from 'next/image'

import { CommentValidation } from '@/lib/validations/thread'

import { usePathname, useRouter } from 'next/navigation'
import { addCommentToThread } from '@/lib/actions/thread.actions'



interface Props{
    threadId: string, 
    currentUserImg: string,
    currentUserId: string
}

const Comment = ({threadId, currentUserImg, currentUserId}:Props) => {
    console.log("comment")

    const router = useRouter()
    const pathname = usePathname()

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
      console.log("creating thread.."+values.thread);
      
      await addCommentToThread( threadId, values.thread, JSON.parse(currentUserId), pathname)
      form.reset();
    //   router.push("/")
    }

    return (
        <Form {...form}>
        <form
         className="comment-form"
         onSubmit={form.handleSubmit(onSubmit)}
        >
             <FormField
             control={form.control}
             name="thread"
             render={({ field }) => (
               <FormItem className="flex items-center w-full gap-3">
                 <FormLabel>
                  <Image
                    src={currentUserImg}
                    alt="profile image"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  </FormLabel>
                 <FormControl className="border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Comment.."
                    className="no-focus text-light-1 outline-none"
                    {...field}
                    />
                 </FormControl>
               </FormItem>
             )}
           />

          <Button type="submit" className="comment-form_btn">
            Reply
          </Button>
        </form>
        </Form>
    )

}

export default Comment;