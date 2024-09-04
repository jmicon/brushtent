"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { CldUploadWidget } from 'next-cloudinary';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
// import { Description } from "@radix-ui/react-dialog"
// import { blob } from "stream/consumers"
import { useToast } from "@/components/ui/use-toast"
import { CloudFog, Loader2 } from "lucide-react"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }).max(50, {
    message: "Title must be less than 50 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }).max(300, {
    message: "Description must be less than 300 characters.",
  }),
  tags: z.string().max(300, {
    message: "Tags must not exceed 300 characters.",
  }),
  images: z.instanceof(FileList).optional()
  .superRefine((val, ctx) => {
    if (!!val) {
        for (const [key, value] of Object.entries(val)) {
            if (!value.type.startsWith("image/")) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    maximum: 3,
                    type: "array",
                    inclusive: true,
                    message: "Non image files cannot be uploaded.",
                })
            }
            if (value.size > 4000000) {
                ctx.addIssue({
                    code: z.ZodIssueCode.too_big,
                    maximum: 3,
                    type: "array",
                    inclusive: true,
                    message: "Cannot upload an image larger than 4mb.",
                })
            }
        }
    }
    if (!!val && val?.length > 5) {
        ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            maximum: 3,
            type: "array",
            inclusive: true,
            message: "Too many items 😡.",
        })
    }
    if (val?.length === 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.too_big,
            maximum: 3,
            type: "array",
            inclusive: true,
            message: "Include at least 1 image.",
        })
    }
  })
})

const UploadFormSigned = () => {
    const [images, setImages] = useState<string[]>()
    const [resource, setResource] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const { toast } = useToast()

    const convertToBase64 = (imageFile:File) => {
        const reader = new FileReader()
    
        return new Promise((resolve, reject) => {
            if (imageFile !== null) reader.readAsDataURL(imageFile)
            
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }
    
    const addImages = async (e:React.ChangeEvent<HTMLInputElement>) => {
        const imageFiles = e.target.files
        const b64List: string[] = []
    
        if (imageFiles === null) return 
        for (let file = 0; file < imageFiles.length; file++) {
            let data = await convertToBase64(imageFiles[file])
            if (typeof(data) === "string") b64List.push(data)
        }
        setImages(b64List)
    }

      // string of tags to be separated only by commas
    const cleanTags = (tagString: string) => {
        const tagsArr = tagString.split(',');
        const cleanedTags = tagsArr.map(tag => tag.trim());
        return cleanedTags.join(',');
    }
    
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            tags: "",
            images: undefined,
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        // if (!values.file || !values.images) return 
        
        if (typeof values.images === 'undefined') return 
        
        const imagesString = JSON.stringify(images)

        const cleanTagsString = cleanTags(values.tags)

        const formData = new FormData()
        formData.append('file_secure_url', resource.secure_url)
        formData.append('file_public_id', resource.public_id)
        formData.append("title", values.title)
        formData.append("description", values.description)
        formData.append("tags", cleanTagsString)
        formData.append("images", imagesString)  

        setLoading(true)
    
        try {
            const response = await fetch(`/api/product/create/test`, {
                method: "POST",
                body: formData
            })
            if (!response.ok) {
                const errorResponse = await response.json()
                console.log(errorResponse);
                console.log("error");
                if (typeof errorResponse.error === "string") {
                    toast({
                        description: `Error: ${errorResponse.error}`
                    })
                }
            } else {
                const responseMessage = response.json()
                console.log(responseMessage)
                  toast({
                    description: "Successfully uploaded"
                  })
            }
        } catch (error) {
            console.log(error);       
            toast({
                description: `error: ${error}`
              })     
        } finally {
            setLoading(false)            
        }
      }    

    const imageRef = form.register("images");

    
  return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                <Input placeholder="Your title" {...field} />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                <Textarea {...field}/>
                {/* <Input placeholder="shadcn" {...field} /> */}
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                <Textarea placeholder="Separate tags by comma (eg: foliage, sketch)" {...field}/>
                {/* <Input placeholder="shadcn" {...field} /> */}
                </FormControl>
                <FormDescription>
                Tags can influence where you show in search results.
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
            />
        <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                <Input id="picture" type="file" multiple {...imageRef} onChange={e => addImages(e)}/>
                </FormControl>
                <FormDescription>
                Include up to 5 images.
                </FormDescription>
                <FormMessage />
            </FormItem>
            )}
            />
            <div>
                <FormLabel>Upload your download file</FormLabel>
                <div className="pt-2">
                    <CldUploadWidget 
                        uploadPreset="abr_upload" 
                        signatureEndpoint="/api/product/create/sign-cloudinary-params"
                        onSuccess={(result, { widget }) => {
                            setResource(result?.info)
                            console.log(result?.info);
                        }}
                    >
                    {({ open }) => {
                        
                        return (
                        <div onClick={() => open()} className="border w-full text-left py-3 px-4 text-sm rounded-lg duration-250 cursor-default">
                            <span className="font-light font-">Browse...&nbsp;&nbsp;</span>
                            {!resource ? <span>No file selected.</span> : <span> {resource.public_id.substring(14)}</span>}
                        </div>
                        );
                    }}
                    </CldUploadWidget>
                </div>
            </div>

        {!loading ? <Button type="submit">Create</Button>
        : (
            <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
            </Button>
        )    
    }
        </form>
    </Form>
  )
}

export default UploadFormSigned