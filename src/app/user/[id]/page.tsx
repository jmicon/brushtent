import BetterFeed from '@/components/BetterFeed'
import Feed from '@/components/Feed'
import PaginationContainer from '@/components/PaginationContainer'
import React from 'react'
import axios from 'axios'
import EditProfile from '@/components/EditProfile'
import { auth } from "@/auth"

type Props = {
  // userId: string
  }

type data = {
  user: {
    id: number
    name: string
    email: string
    emailVerified: any
    image: string
  },
  products: [{
    product_id: number
    title: string
    description: string
    price: number
    fk_users_id: number
    upload_time: string
    images: string[]
  }],
  total_pages: string
}

const getData = async (userId:string, page:string) => {
  try {
    const response = await axios.get(`${process.env.API_URL}/api/user/products`, {
      params: {
        id: userId,
        page: page
      },
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data
  } catch (error:any) {
    console.error('Failed to fetch data:', error.message)
    throw error
  }

}

const page = async ({ searchParams, params }: {
    searchParams: {[key:string]: string}
    params: {id: string}
}) => {
  
    const id = params.id
    let page = searchParams['page'] ?? '1' 
    const data = await getData(id, page)
    const session = await auth()
    const sessionIdString = session?.user?.id?.toString() 

    console.log("client", id);
    if (data.user) console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("client", data.user);

  return (
    <>
      {!data.user[0] ? (
        <div className='p-4 flex flex-col items-center'>
          <img 
            src={"https://res.cloudinary.com/djliadbvy/image/upload/v1721024991/uo02rbkhegkiwym6kplw.png"} 
            alt="profile image" 
            className='w-32 rounded-lg'
          />
          <h1 className='pt-3'>User not found</h1>
        </div>
      )
      : (
        <>
        <div className='p-4 flex flex-col items-center'>
          <img 
            src={!!data.user[0].image ? data.user[0].image : "https://res.cloudinary.com/djliadbvy/image/upload/v1721024991/uo02rbkhegkiwym6kplw.png"} 
            alt="profile image" 
            className='w-32 rounded-lg'
          />
          {sessionIdString === id && <EditProfile session={session}/> }
          <div className='pt-3'>{data.user[0].name}</div>
        </div>
        <div>
          <div className='flex justify-center pt-3 text-xl'>Content</div>
          <BetterFeed productData={data.products}/> 
          <PaginationContainer totalPages={data.total_pages} currentPage={Number(page)} route={`/user/${id}`}/>
        </div>
        </>
      )
      }
    </>
  )
}

export default page