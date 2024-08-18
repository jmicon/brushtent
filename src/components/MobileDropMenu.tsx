"use client"
import Link from "next/link"
import { SignInClientButton } from "./SignInClientButton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SignOutClient } from "./SignOutClient"
import LoginDialog from "./LoginDialog"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type Props = {
  session?: any
}

const MobileDropMenu = ({ session }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round" ><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-center bg- gap-4 py-8 ">
            <Button variant="outline" asChild>
              <Link href={`/upload`}>Upload Content</Link>
            </Button>

          <Button variant="outline" asChild>
          {!session 
          ? 
            <Link href={`/user/preview`}>My Profile</Link>
            // <LoginDialog />
          :
            <Link href={`/user/${session.userId}`}>My Profile</Link>
          }
          </Button>

          {!session 
        ? 
          (
            <Button asChild>
            <SignInClientButton />
            </Button>
          )
        :
          (
            <SignOutClient />
          )
        }

        </div>
        <SheetFooter>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MobileDropMenu
