import BetterFeed from '@/components/BetterFeed'
import PaginationContainer from '@/components/PaginationContainer'
import React from 'react'
import axios from 'axios'
import { auth } from "@/auth"
import EditProfilePreview from '@/components/EditProfilePreview'


const getData = async (page:string) => {
  try {
    const response = await axios.get(`${process.env.API_URL}/api/user/products`, {
      params: {
        id: 1,
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

const page = async ({ searchParams }: {
  searchParams: {[key:string]: string}
}) => {
  
  let page = searchParams['page'] ?? '1' 
  const data = await getData(page)

  return (
    <>
    <div className='text-center py-4'><u>Preview</u></div>
    {!data?.user?.[0] ? (
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
          src={!!data.user.image ? data.user.image : "https://res.cloudinary.com/djliadbvy/image/upload/v1721024991/uo02rbkhegkiwym6kplw.png"} 
          alt="profile image" 
          className='w-32 rounded-lg'
        />
        <EditProfilePreview /> 
        <div className='pt-3'>{data.user[0].name}</div>
      </div>
      <div>
        <div className='flex justify-center pt-3 text-xl'>Content</div>
        <BetterFeed productData={data.products}/> 
        <PaginationContainer totalPages={data.total_pages} currentPage={Number(page)} route={`/user/preview`}/>
      </div>
      </>
    )
    }
    </>
  )
}

export default page