
import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("github", { redirectTo: "/" })
      }}
    >
      <button type="submit" className="py-1 p-4 w-full max-w-md bg-blue-500 text-white rounded-md hover:bg-blue-400 duration-100">
        Sign In
      </button>
    </form>
  )
} 