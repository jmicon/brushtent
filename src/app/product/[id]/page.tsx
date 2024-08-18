import test from '@/media/logo.jpg'
import { Button } from "@/components/ui/button";
import ImageSlider from '@/components/ImageSlider';
import { Carousel } from '@/components/ui/carousel';
// import { useSearchParams } from 'next/navigation'
import Link from 'next/link';
import { badgeVariants } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar } from '@/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

type imageObject = {
  id: number
  image: string
}
type tagObject = {
  id: number
  tag: string
}

type productDataType = {
  product_id: number
  title: string
  description: string
  price: number
  fk_users_id: number
  upload_time: string
  tags: tagObject[]
  images: imageObject[]
  download: string  
  user_id: number
  user: string
  user_image: string

}

async function getData ( id: string) {
  const res = await fetch(`${process.env.API_URL}/api/product/get/one?id=${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    // cache: 'no-cache', 
  })
  if (!res.ok) throw new Error('Failed to fetch data')
  return res.json()
}

const page = async ({ params }: {
  params: {id: string}
}) => {
  const id = params.id
  const dataArray = await getData(id)
  const data:productDataType = dataArray[0]

  return (
    <>
        <section className='px-2 md:max-w-screen-lg mx-auto pt-2'>
          <div className='flex items-center'>
            <Avatar>
              <AvatarImage src={data.user_image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='text-sm font-medium pl-2'>By 
              <Link href={`/user/${data.user_id}`}>
                <span className='text-sm font-medium text-cyan-600 cursor-pointer'> {data.user}</span>
              </Link>
            </div>
          </div>
          <div className='aspect-square w-full pt-4 md:max-w-lg md:mx-auto'>
              <ImageSlider styles='w-full border-b pb-2' images={data.images} product_id={data.product_id} imageLink={false}/>
              <div className='flex justify-center items-center'>{data.images.map(image => {
                return (
                  <Dialog key={image.id}>
                    <DialogTrigger>
                        <img src={image.image} alt="img" width={50} height={50} className='aspect-square mx-1 mt-2 hover:brightness-90 duration-100'/>
                    </DialogTrigger>
                    <DialogContent>
                      <img src={image.image} alt='product image' className='w-full ' />
                    </DialogContent>
                  </Dialog>
                )
              })}</div>
          </div>    

            <div className='p-4'>
              <h1 className='py-4 text-xl'>{data.title}</h1>
              <Link href={data.download[0]}>
                <button className='bg-slate-900 text-white p-4 rounded-lg w-full hover:bg-slate-800 duration-200'>Download</button>
              </Link>
              {/* <Button>Download</Button> */}
              <div className='py-4'>
                {data.tags?.map(tag => {
                  return (
                    <div key={tag.id} style={{marginLeft: ".5rem"}} className={badgeVariants({ variant: "outline" })}>{tag.tag}</div>
                  )
                })}
              </div>
              <hr/>
              <p className='py-2'>{data.description}</p>
            </div>

        </section>
    </>
  )
}

export default page