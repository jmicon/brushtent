import { signIn } from "next-auth/react"
import { SignInClientButton } from "./SignInClientButton"
 
export function SignInClient() {
  return (
   <SignInClientButton />
//    <button onClick={() => signIn("github", { redirectTo: "/" })}>
//       Sign In
//     </button>
  )
}