import Link from 'next/link'
import React from 'react'
import { SignIn } from './SignIn'
import { SignOut } from './SignOut'

type Props = {
    session: any
}

const RegularMenu = ({ session }: Props) => {
  return (
    <div className='w-full flex justify-end text-sm font-medium items-center'>
        {!!session ?
        (
        <div className='mx-5 cursor-pointer hover:text-cyan-500 duration-75'>
            <Link href={`/user/${session.userId}`}>Profile</Link>
        </div>
        ) :
        (
        <div className='mx-5 cursor-pointer hover:text-cyan-500 duration-75'>
            <Link href={`/user/preview`}>Profile</Link>
        </div>
        )}
        <div className='mx-5 cursor-pointer hover:text-cyan-500 duration-75'>
            <Link href={`/upload`}>Upload Content</Link>
        </div>
        {!!session ? 
        <div className='ml-5 cursor-pointer hover:text-cyan-500 duration-75'><SignOut /></div>
        :
        <div className='ml-5'><SignIn /></div>
        }
    </div>
  )
}

export default RegularMenu