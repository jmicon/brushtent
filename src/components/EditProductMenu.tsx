"use client"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useToast } from "@/components/ui/use-toast"

import { Pencil, Trash } from 'lucide-react';
import { Input } from "./ui/input"
import Image from "next/image"
import { useState } from "react"

type imageObject = {
    id: number
    image: string
    public_id: string
    order: number
  }

type Props = {
    product_user_id: number
    product_id: number
    images: imageObject[]
}

const EditProductMenu = ({ product_user_id, product_id, images }: Props) => {
    const { toast } = useToast()

    const [imageOrder, setImageOrder] = useState([])

    const deleteMe = async (product_user_id: number, product_id: number, images:imageObject[]) => {
        let publicIdList = []
        for (let i in images) {
            publicIdList.push(images[i].public_id)
        }
        console.log(publicIdList);
        console.log(images);
        const res = await fetch(`/api/product/delete?user_id=${product_user_id}&product_id=${product_id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({
                imagesData: publicIdList
            })
        })
        if (!res.ok) throw new Error('Failed')
        else {
            const response = await res.json()
            toast({
                description: `Successfully Deleted`
            })
        }
    }
  return (
    <Popover>
        <PopoverTrigger className="flex">
        <Pencil />
        </PopoverTrigger>
        <PopoverContent className="w-full">
            <Dialog>
                <DialogTrigger className="w-full text-left flex py-1 px-2 hover:text-red-600 duration-100">
                    <Trash className="pr-1"/>
                    Delete
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-4">
                    <DialogHeader>
                    <DialogTitle className="text-center">Are you sure?</DialogTitle>
                    <DialogDescription className="text-center">
                        
                        This action cannot be undone. Are you sure you want to permanently
                        delete this product from our servers?
                    </DialogDescription>
                    </DialogHeader>
                    <DialogClose asChild>
                        <Button variant="destructive" onClick={() => deleteMe(product_user_id, product_id, images)}>Delete</Button>
                    </DialogClose>
                </DialogContent>
            </Dialog>            
        </PopoverContent>
    </Popover>

  )
}

export default EditProductMenu

// edit image order
// <Dialog>
// <DialogTrigger className="w-full text-left flex py-1 px-2 duration-100">
//     Edit image order
// </DialogTrigger>
// <DialogContent className="p-4">
//     <DialogHeader>
//     <DialogTitle className="text-center">Are you sure?</DialogTitle>
//     <DialogDescription className="text-center">
//         <div className="flex flex-wrap">
//         {images.map((image) => {
//             return (
//                 <div key={image.id} className="px-2">
//                     <img src={image.image} alt={`image ${image.order}`} className="max-w-sm max-h-56 border"/>
//                     <Input value={image.order} className="mt-4 text-center w-full"/>
//                     {/* <Image src={image.image} alt={`image ${image.order}`} /> */}
//                 </div>
//             )
//         })}
//         </div>
//     </DialogDescription>
//     </DialogHeader>
//     <DialogClose asChild>
//         <Button>Change</Button>
//     </DialogClose>
// </DialogContent>
// </Dialog>
