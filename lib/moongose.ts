import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
  mongoose.set('strictQuery', true)
  // Fields that are present in the database but not defined in your schema will be excluded from the response.

  if (process.env.MONGODB_URL == null) { console.log('MONGODB_URL not found'); return }

  if (isConnected) { console.log('Already connected to MongoDB') }

  console.log(`connecting to mongo db...`)
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    isConnected = true
    console.log('connected to mongo db')
  } catch (error: any) {
    console.log(`Error connecting to mongo db ${error.message}`)
  }
}
