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
import { Label } from "@/components/ui/label"
  
type Session = {
    user: {
        id: number,
        name: string,
        email: string,
        emailVerified: any,
        image: string,
        role: string,
    },
    id: number,
    userId: number,
    expires: string,
    sessionToken: string,
}

type Props = {
    session: any
}

const EditProfile = ({ session }: Props) => {
    const [name, setName] = useState<string>(session.user.name)
    const [image, setImage] = useState<string>("")

    const convertToBase64 = (imageFile:File) => {

        const reader = new FileReader()
    
        return new Promise((resolve, reject) => {
            if (imageFile !== null) reader.readAsDataURL(imageFile)
            
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        
        })
    }

    const addImage = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const imageFile = e.target.files
        if (imageFile !== null) {
            let base64image = await convertToBase64(imageFile[0])
            if (typeof base64image === "string") setImage(base64image)
        }
    // console.log(image)
    // console.log(name);
    }  

    const submitChanges = async () => {
       
        const response = await fetch(`/api/user/edit`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json', // Make sure to include content-type header
            },
            body: JSON.stringify({
                name: name,
                image: image
            })
        })
        if (!response.ok) {
            const errorData = response.json()
            console.log(errorData);
        } else {
            const data = response.json()
            console.log(data);
        }

    }

  return (
    <Sheet>
        <SheetTrigger asChild>
        <Button variant="outline" className="mt-4">Edit profile</Button>
        </SheetTrigger>
        <SheetContent onSubmit={submitChanges}>
        <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
            Make changes to your profile here. Click save when you're done.
            </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
                Name
            </Label>
            <Input id="name" onChange={e => setName(e.target.value)} value={name} className="col-span-3" />
            </div>
        </div>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
                Image
            </Label>
            <Input id="image" accept='image/*' type='file' className="col-span-3" onChange={e => addImage(e)}/>
            </div>
        </div>
        <SheetFooter>
            <SheetClose asChild>
            <Button type="submit" onClick={submitChanges}>Save changes</Button>
            </SheetClose>
        </SheetFooter>
        </SheetContent>
    </Sheet>
  )
}

export default EditProfile