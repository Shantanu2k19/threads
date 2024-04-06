'use server'
//we cant create db actions from browser side 
//reason : cross origin requests not allowed 
//hence, need to use this nextjs directive 

import { connectToDB } from "../moongose"
import Thread from "../models/thread.model"
import User from "../models/user.model";
import { revalidatePath } from 'next/cache'
import { skip } from "node:test";

interface Params{
    text: string,
    author: string, 
    communityId: string | null,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params){
    try{
        connectToDB();
        console.log(`got values: text:${text}, author:${author}, commId${communityId}, path:${path}`)
        const createdThread = await Thread.create({
            text,
            author,
            community: null, //null if not amember of any community 
        });

        //update user model 
        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id}
        })

        revalidatePath(path);
        console.log(`create success`);
    }     
    catch (error: any){
        throw new Error(`Error creating thread: ${error.message}`)
    }
};

export async function fetchPost(pageNumber=1, pagesize=20){
    console.log("fetching posts")
    connectToDB();

    //calculate the number of posts to skip 
    const skipamount = (pageNumber-1)*pagesize;

    //fetch posts with no parents (top level threads)
    const postQuerry = Thread.find({parentId: { $in: [null, undefined]}})
    .sort({createdAt:'desc'})
    .skip(skipamount)
    .limit(pagesize)
    .populate({path: 'author', model: User})
    .populate({
        path: 'children',
        populate:{
            path: 'author',
            model: User,
            select: "_id name parentId image"
        }
    })

    const totalPostCount = await Thread.countDocuments({parentId: {
        $in: [null, undefined]
    }})

    const posts = await postQuerry.exec();
    
    const isNext = totalPostCount>skipamount+posts.length;
    
    return {posts, isNext};
}

export async function fetchThreadById(id:string) {
    connectToDB();

    try{
        //TODO : populate community 
        const thread = await Thread.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: "_id id name image"
        })
        .populate({
            path: 'children', 
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: "_id id name parentId image"
                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: "_id id name parentId image"
                    }
                }
            ]
        }).exec()
        return thread;
    }
    catch (error: any){
        throw new Error(`Error fetching thread : ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string, 
    path: string
){
    connectToDB();
    try{
        const originalThread = await Thread.findById(threadId);

        if(!originalThread) 
            throw new Error("Thread not found")

        //create new thread
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId
        })
        
        //save new thread
        const savedCommentThread = await commentThread.save();

        //update original thread to include new comment 
        originalThread.children.push(savedCommentThread._id);

        await originalThread.save()

        revalidatePath(path)

    } catch( error : any){
        throw new Error(`Error adding comment : ${error.message}`)
    }
}