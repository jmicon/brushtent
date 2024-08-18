import logo from '@/media/logo-removebg.png'
import Link from 'next/link'
import MobileDropMenu from './MobileDropMenu';
import { auth } from "@/auth"
import RegularMenu from './RegularMenu';


const Nav = async () => {
  const session = await auth()
  
  return (
    <>
    <div className='w-full border-b'>
      <div className='sticky w-full top-0 z-10 xl:max-w-screen-xl xl:mx-auto'>
        <div className='flex items-center justify-between px-2'>
          <Link href={`/`}><img src={logo.src} alt="logo.png" width="60" className='cursor-pointer'/></Link>
          <div className='md:hidden flex'>
            <MobileDropMenu session={session}/>
          </div>
          <div className='md:flex hidden'>
            <RegularMenu session={session} />
          </div>
        </div>            
      </div>
    </div>
    </>
  )
}

export default Nav