'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useState } from "react"

const EditProfilePreview = () => {
    const [name, setName] = useState("")

  return (
    <Sheet>
        <SheetTrigger asChild>
        <Button variant="outline" className="mt-4">Edit profile</Button>
        </SheetTrigger>
        <SheetContent>
        <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
            </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
                Name
            </label>
            <Input id="name" onChange={e => setName(e.target.value)} value={name} className="col-span-3" />
            </div>
        </div>
        <SheetFooter>
            <SheetClose asChild>
            <Button type="submit">Save changes</Button>
            </SheetClose>
        </SheetFooter>
        </SheetContent>
    </Sheet>
  )
}

export default EditProfilePreview