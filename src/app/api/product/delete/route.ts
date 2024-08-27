import sql from "@/app/api/postgres"
// @ts-ignore
import {v2 as cloudinary} from 'cloudinary';
import { auth } from "@/auth"

// authenticate, match the user id to the product's fk user id, delete images from cloudinary, 

export const DELETE = auth(async function DELETE(req) {
    try {
        if (!req.auth) return Response.json({error: "You are not logged in"}, { status: 401 })
            
        // get authenticated user id 
        const tempCurrentUserId = req.auth?.user?.id
        const currentUserId = Number(tempCurrentUserId)
        // get product and user id that are attached to product
        const { searchParams } = new URL(req.url)
        const productId = searchParams.get('product_id')
        const productUserId = Number(searchParams.get('user_id'))
        // get the array of image objects for the public_id's
        const { imagesData } = await req.json()

        // Check if the authenticated user is the owner of the product
        if (currentUserId !== productUserId) return Response.json({Error: "You are not authorized to make this change."})

        // delete product images from cloudinary (different way of doing it)
        // const images = await sql`
        // SELECT * FROM 
        // product_image 
        // WHERE 
        // fk_product_id = ${productId};
        // `
        // const imagesToDelete: string[] = []
        
        // for (let i in images) {
        //     imagesToDelete.push(images[i].public_id)
        // }

        const deletedImageFiles = await cloudinary.api
        .delete_resources(imagesData)    
        // console.log(deletedImageFiles);

        // delete product download file from cloudinary
        const downloadFile = await sql`
        SELECT public_id FROM 
            product_download 
        WHERE 
            fk_product_id = ${productId}; 
        `

        const deletedDownloadFile = await cloudinary.api
        .delete_resources([downloadFile[0].public_id], { type: 'upload', resource_type: 'raw' })
        // console.log(deletedDownloadFile)

        // Delete rows from database
        const deletedProductDownload = await sql`
        DELETE FROM 
            product_download 
        WHERE 
            fk_product_id = ${productId};
        `
        
        const deletedProductImages = await sql`
        DELETE FROM 
            product_image 
        WHERE 
            fk_product_id = ${productId};
        `
        
        const deletedTags = await sql`
        DELETE FROM 
            tag 
        WHERE 
            fk_product_id = ${productId};
        `

        const deletedProduct = await sql`
        DELETE FROM 
            product 
        WHERE 
            product_id = ${productId};
        `

        return Response.json({deletedProduct, deletedProductDownload, deletedProductImages, deletedTags})

    } catch (error: any) {
        return Response.json({error: error.message})
    }
})