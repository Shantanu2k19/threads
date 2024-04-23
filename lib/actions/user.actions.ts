'use server'

import { revalidatePath } from 'next/cache'
import User from '../models/user.model'
import { connectToDB } from '../moongose'
import Thread from '../models/thread.model'
import { FilterQuery, SortOrder } from 'mongoose'

interface Params {
  userId: string
  username: string
  name: string
  bio: string
  image: string
  path: string
}
// using this interface Params for passing values, we dont need to take care of 
// order when passing values 
export async function updateUser ({
  userId,
  username,
  name,
  bio,
  image,
  path
}: Params): Promise<void> {
  // Promise<void> specifies that this function returns a promise that resolves to void, meaning it doesn't return any meaningful value.
  connectToDB()
  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true
      },
      { upsert: true }
    // both update and insert
    )

    if (path === '/profile/edit') {
      revalidatePath(path)
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user :${error.message}`)
  }
}

export async function fetchUser(userId: string){
  try{
    connectToDB();

    return await User.findOne({id : userId})
    //.populate({
    //  path: 'communities',
    //  model: Community
    //})
  }
  catch (error: any){
    console.log("error fetch user")
    throw new Error(`Failed to fetch user : ${error.message}`)
  }
}

export async function fetchUserPosts(userId: string){
  try{
    connectToDB();

    //TODO : populate community

    //final all the threads authored by given userId
    const threads = await User.findOne({id: userId})
      .populate({
        path: 'threads',
        model: Thread,
        populate: {
          path: 'children',
          model: Thread,
          populate:{
            path: 'author',
            model: User, 
            select: 'name image id'
          }
        }
      })

    //console.log(threads)

    return threads
  }
  catch (error: any){
    throw new Error(`Failed to fetch user posts : ${error.message}`)
  }
}


export async function fetchSearchUsers({
  userId, 
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc"
} : {
  userId: string, 
  searchString? : string,
  pageNumber?: number, 
  pageSize?: number, 
  sortBy?: SortOrder
}) {
  try{
    connectToDB()

    //no of users to skip base on paege no & size
    const skipAmount = (pageNumber-1) * pageSize;
    const regex = new RegExp(searchString, 'i')

    const query : FilterQuery<typeof User>= {
      id: {$ne: userId}
    }

    if(searchString.trim() !== ''){
      query.$or = [
        { username: { $regex: regex }},
        {name: {$regex: regex}}
      ]
    }

    const sortOptions = { createdAt: sortBy }
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)

    const totalUsersCount = await User.countDocuments(query)

    const users = await usersQuery.exec();
    const isNext = totalUsersCount > skipAmount + users.length

    return {users, isNext}
  }
  catch (error: any){
    throw new Error(`Failed to fetch users for search : ${error.message}`)
  }
}  

export async function getActivity(userId: string){
  try{
    connectToDB()

    //all threads created by user
    const userThreads = await Thread.find({author: userId});

    //collect child thread ids from children field
    const childThreadIds = userThreads.reduce((acc, usrThread) => {
      return acc.concat(usrThread.children)
    }, []) //not a dependency array, it is default accumulator(values)

    //find all the replies 
    const replies = await Thread.find({
      _id: {$in : childThreadIds},
      author: {$ne: userId}
    }).populate({
      path: 'author',
      model: User, 
      select: 'name image _id'
    })
    
    return replies
  }
  catch (error: any){
    throw new Error(`Failed to fetch activity : ${error.message}`)
  }
}