import React from 'react'
import { signIn } from 'next-auth/react';

export function SignInClientButton() {

    const handleSignIn = () => signIn("github", { redirectTo: "/" }) 

  return (
      <button 
        onClick={() => {signIn("github", { redirectTo: "/" })}} 
        className={`py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-400 duration-100 cursor-pointer`}>
            Sign In
      </button>
  )

}