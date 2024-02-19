"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { UserValidation } from '@/lib/validations/user'
import * as z from "zod";


import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from '../ui/input'
import { Button } from '../ui/button';

interface Props{
    user: {
        id: string | "", 
        objectId: string,
        username: string,
        name : string,
        bio : string,
        image : string
    };
    btnTitle : string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues : {
            profile_photo  : "",
            name : "",
            username : "",
            bio : ""
        }
    });

    function onSubmit(values: z.infer<typeof UserValidation>) {
      console.log(values)
    }

    return (
       <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <FormField
             control={form.control}
             name="username"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Username</FormLabel>
                 <FormControl>
                   <Input placeholder="shadcn" {...field} />
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

export default AccountProfile;
