/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client' // for using forms
import React, { useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserValidation } from '@/lib/validations/user'
import Image from 'next/image'
import type * as z from 'zod' // using shadcn
import { isBase64Image } from '@/lib/utils'
import { useUploadThing } from '@/lib/uploadThing'
import { usePathname, useRouter } from 'next/navigation'

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
import { updateUser } from '@/lib/actions/user.actions'

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
  //console.log(user)
  const [files, setFiles] = useState<File[]>([])
  const { startUpload } = useUploadThing('media')
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: '', // Insert photo from user.image
      name: user?.name || '',
      username: user?.username || '',
      bio: user?.bio || ''
    }
  })

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    console.log("got image")
    e.preventDefault()
    const fileReader = new FileReader()

    if ((e.target.files != null) && e.target.files.length > 0) {
      const file = e.target.files[0]

      setFiles(Array.from(e.target.files))

      if (!file.type.includes('image')) return

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || ''

        fieldChange(imageDataUrl)
      }
      fileReader.readAsDataURL(file)
    }
  }


  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    console.log('submitted :', values)

    const blob = values.profile_photo
    const hasImageChanged = isBase64Image(blob) // how?
    if(hasImageChanged) 
      console.log("Image has changed")
    else
      console.log("image havent changed")

    try
    {
      if (hasImageChanged) {
        const imRes = await startUpload(files)

        if (imRes?.[0].url) {
          values.profile_photo = imRes[0].url
        }
      }
    }
    catch (error)
    {
      console.log(`encountered error uploadthing : `+error)
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      image: values.profile_photo,
      path: pathname
    })

    if(pathname === '/profile/edit'){
      router.back();
    }
    else {
      router.push('/');
    }
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
                 <FormControl className="flex-1 text-base-semibold text-gray-200">
                   <Input
                      type="file"
                      accept="image/*"
                      placeholder="Upload a photo"
                      className="account-form_image-input"
                      onChange={(e) => { handleImage(e, field.onChange) }}
                    />
                 </FormControl>
                 <FormItem />
               </FormItem>
             )}
           />

            <FormField
             control={form.control}
             name="name"
             render={({ field }) => (
               <FormItem className="flex flex-col w-full gap-3">
                 <FormLabel className='text-base-semibold text-light-2'>
                  Name
                  </FormLabel>
                 <FormControl>
                   <Input
                      type="text"
                      className="account-form_image"
                      {...field}
                    />
                 </FormControl>
                 <FormItem />
               </FormItem>
             )}
           />

            <FormField
             control={form.control}
             name="username"
             render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className='text-base-semibold text-light-2'>
               Username
               </FormLabel>
              <FormControl>
                <Input
                      type="text"
                      className="account-form_image"
                      {...field}
                    />
                 </FormControl>
                 <FormItem />
               </FormItem>
             )}
           />

            <FormField
             control={form.control}
             name="bio"
             render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-3">
                 <FormLabel className='text-base-semibold text-light-2'>
                  Bio
                  </FormLabel>
                 <FormControl>
                   <Textarea
                      rows={10}
                      className="account-form_image"
                      {...field}
                    />
                 </FormControl>
                 <FormItem />
               </FormItem>
             )}
           />
          <Button type="submit" className='bg-primary-500'>Submit</ Button>
         </form>
       </Form>
  )
}

export default AccountProfile
