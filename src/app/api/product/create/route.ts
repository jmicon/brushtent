import {v2 as cloudinary} from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import sql from "@/app/api/postgres"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export const POST = auth(async function POST(req) {
    if (!req.auth) return Response.json({error: "You are not logged in"}, { status: 401 })
    if (!req.auth.user) return Response.json({error: "You were authenticated, but your user object does not exist"}, { status: 401 })
    const user = req.auth.user

    const formData = await req.formData();

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tags = formData.get('tags') as string
    const images = formData.get('images') as string
    const file = formData.get('file')
    const imageArray = await JSON.parse(images)
    try {
        
        // Convert strings to the desired data type
        const tagArray = tags.split(',')
    
        // Cleaning tags (removing spaces) and checking if there are tags
        const cleanedTags = tagArray.map(tag => tag.trim());
        let isTags = true
        // Check if tag array is empty or is === ['']
        if (cleanedTags.length === 1 && cleanedTags[0] === '') isTags = false 
        // Handling tag errors
        if (isTags) {
            if (cleanedTags.length > 20) return Response.json({error: "You cannot include more than 20 tags"}, { status: 400 })
            for (let tag in cleanedTags) {
                if (cleanedTags[tag].length > 20) return Response.json({error: "A single tag cannot have more than 20 characters"}, { status: 400 }) 
                if (cleanedTags[tag] === '') return Response.json({error: "A tag cannot be an empty string"}, { status: 400 }) 
            }
        }
    
        // return error if files are unwanted 
        if (imageArray.length > 5) return Response.json({error: "You cannot upload more than 5 images"}, { status: 400 })
        if (tagArray.length > 10) return Response.json({error: "You cannot have more than 10 tags"}, { status: 400 })
        for (let image in imageArray) {
            // checks if file is an image
            if (!imageArray[image].startsWith('data:image/')) return Response.json({ error: 'Uploaded files must be images' }, { status: 400 }) 
            // checks if file is less than 10mb
            let base64String = imageArray[image].substring(imageArray[image].indexOf(',') + 1)
            let kb = Math.ceil( ( (base64String.length * 6) / 8) / 1000 );        
            console.log(image,": ",kb);
            if (kb > 10000) return Response.json({error: "An image cannot be larger than 10mb"}, { status: 400 })
    
        }
    
        // Handle images and upload to cloudinary
        const imageList:string[] = []
        const publicIdList:string[] = []
        
        // checks if more than 5 images were uploaded
        if (imageArray.length > 5) return Response.json({error: "You cannot upload more than 5 images"}, { status: 400 })
        
        for (let image = 0; image < imageArray.length; image++) {
            // checks if file is an image
            if (!imageArray[image].startsWith('data:image/')) return Response.json({ error: 'Uploaded files must be images' }, { status: 400 }) 
                
            // console.log(`file ${image + 1} passed`)
        }
        // upload array of images to cloudinary
        for (const image in imageArray) {
            const uniqueImageName = `${uuidv4()}`;
    
            const cloudinaryImageResult = await cloudinary.uploader.upload(
                imageArray[image],
                { public_id: uniqueImageName,  folder: "product images" }
            )
            // console.log(cloudinaryImageResult)
            imageList.push(cloudinaryImageResult.secure_url)
            publicIdList.push(cloudinaryImageResult.public_id)
        }

        // upload downloadable file to cloudinary
        let downloadFile
        let filePublicId
        if (file instanceof File) {
            const random = (Math.random() + 1).toString(36).substring(6)
            const uniqueFileName = `${random}${file.name}`;
            const fileBuffer = await file.arrayBuffer();
            const fileStream = Buffer.from(fileBuffer);
      
            cloudinary.uploader.upload_stream({ resource_type: "auto", folder: "product files", public_id: uniqueFileName}, async (error, result) => {
              if (error) {
                console.error("Error uploading to Cloudinary:", error)
                return Response.json(error)
              } else {
                // console.log("File uploaded to Cloudinary:", result);
                // console.log(typeof(result));
                if (result === undefined) return Response.json({error: "download file result is undefined"}, { status: 400 })
                downloadFile = result.secure_url
                filePublicId = result.public_id
                
                
                const newProductDownload = await sql`
                INSERT INTO product_download
                    (product_download_link, public_id, FK_product_id)
                VALUES
                    (${downloadFile}, ${filePublicId}, ${newProductId})
                RETURNING *;
                `
                // console.log(newProductDownload);
              }
            })
            .end(fileStream);
          }

        if (!user.id) return Response.json({error: "User ID cannot be undefined"}, { status: 400 })
        const newProduct = await sql`
        INSERT INTO product 
            (title, description, price, fk_users_id) 
        VALUES 
            (${title}, ${description}, 0, ${user.id})
        RETURNING *;
        `
        // console.log(newProduct)
    
        const newProductId = newProduct[0].product_id
    
        // Upload tags to Database
        // check if there are any tags and skip INSERTING them if there are 0
        if (isTags) {
            const tagsInsert:any = []
            for (let tag in tagArray) {
                let tagValue = {
                    title: tagArray[tag],
                    fk_product_id: newProductId
                } 
                tagsInsert.push(tagValue)
            }
            // console.log(tagsInsert)
    
            const newTags = await sql`INSERT INTO tag ${ sql(tagsInsert) } RETURNING *;`
            // console.log(newTags)
        } 
    
        // Upload image links to Database
        const imageInsert:any = []
        console.log(imageList);
        for (let image in imageList) {
            let imageValue = {
                product_image: imageList[image],
                public_id: publicIdList[image],
                fk_product_id: newProductId,
                order: Number(image)
            }
            imageInsert.push(imageValue)
        }
        const newImages = await sql`INSERT INTO product_image ${ sql(imageInsert) } RETURNING *;`
        // console.log(newImages)
        
        return Response.json('Uploaded')
    
    } catch (error: any) {
        console.log(error.message)
        return Response.json({error: error.message}, {status: 400})
    }
})