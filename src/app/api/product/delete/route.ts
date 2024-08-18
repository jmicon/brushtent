import sql from "@/app/api/postgres"
// @ts-ignore
import {v2 as cloudinary} from 'cloudinary';

export async function POST(req: Request) {
    try {
        const { product_id } = await req.json()

        // delete product images from cloudinary 
        const images = await sql`
        SELECT * FROM 
        product_image 
        WHERE 
        fk_product_id = ${product_id} 
        `
        const imagesToDelete: string[] = []
        
        for (let i in images) {
            imagesToDelete.push(images[i].public_id)
        }

        const deletedImageFiles = await cloudinary.api
        .delete_resources(imagesToDelete)    
        // console.log(deletedImageFiles);

        // delete product download file from cloudinary
        const downloadFile = await sql`
        SELECT * FROM 
        product_download 
        WHERE 
        fk_product_id = ${product_id} 
        `

        const deletedDownloadFile = await cloudinary.api
        .delete_resources([downloadFile[0].public_id], { type: 'upload', resource_type: 'raw' })
        // console.log(deletedDownloadFile)

        // Delete rows from database
        const deletedProductDownload = await sql`
        DELETE FROM 
            product_download 
        WHERE 
            fk_product_id = ${product_id}
        `
        
        const deletedProductImages = await sql`
        DELETE FROM 
            product_image 
        WHERE 
            fk_product_id = ${product_id}
        `
        
        const deletedTags = await sql`
        DELETE FROM 
            tag 
        WHERE 
            fk_product_id = ${product_id}
        `

        const deletedProduct = await sql`
        DELETE FROM 
            product 
        WHERE 
            product_id = ${product_id}
        `

        return Response.json({deletedProduct, deletedProductDownload, deletedProductImages, deletedTags})

    } catch (error: any) {
        return Response.json({error: error.message})
    }
}