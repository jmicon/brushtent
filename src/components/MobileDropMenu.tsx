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
import { Menu } from 'lucide-react';
type Props = {
  session?: any
}

const MobileDropMenu = ({ session }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
      <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col justify-center bg- gap-4 py-8 ">
        <SheetClose asChild>
          <Button variant="outline" asChild>
            <Link href={`/upload`}>Upload Content</Link>
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="outline" asChild>
          {!session 
          ? 
            <Link href={`/user/preview`}>My Profile</Link>
            // <LoginDialog />
          :
            <Link href={`/user/${session.userId}`}>My Profile</Link>
          }
          </Button>
        </SheetClose>

        <SheetClose asChild>
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
        </SheetClose>


        </div>
        <SheetFooter>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MobileDropMenu
