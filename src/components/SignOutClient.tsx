import { signOut } from "next-auth/react"
 
export function SignOutClient() {
    return <button 
        onClick={() => signOut()}
        className={`py-2 border-red-500 border text-red-500 font-medium text-sm rounded-md hover:bg-red-700 duration-100 cursor-pointer`}>
            Sign Out
        </button>
}