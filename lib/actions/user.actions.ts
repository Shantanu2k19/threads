'use server'

import { connectToDB } from "../moongose";

export async function updateUser(): Promise<void> {
    connectToDB();

    
}