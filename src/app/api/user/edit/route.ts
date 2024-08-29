import {v2 as cloudinary} from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import sql from "@/app/api/postgres"
import { auth } from "@/auth"
import { NextResponse } from "next/server"


// Create new prodcut row, include a title, information, price (free paid not supported yet), generate date, list of images, list of tags, default user, user download id
export const PUT = auth(async function PUT(req) {
    if (!req.auth) return Response.json({error: "You are not logged in"}, { status: 401 })
    if (!req.auth.user) return Response.json({error: "You were authenticated, but your user object does not exist"}, { status: 401 })

    const user = req.auth.user
    const id = user?.id
    const data = await req.json();
    const name = data.name
    const image = data.image
    try {

        if (!image && !name) return Response.json({message: "No changes made"})

        if (!name || !id) return Response.json({error: "There was a problem with the name you provided"}, { status: 401 })
        if (name.length > 39) return Response.json({error: "Name must not exceed 39 characters"}, { status: 401 })

        const updatedUserName = await sql`
        UPDATE users 
        SET name = ${name}
        WHERE id = ${id}
        RETURNING users.name;
        `
        if (!image) return Response.json(updatedUserName)

        // upload and add image
        const uniqueImageName = `${uuidv4()}`;

        const cloudinaryImageResult = await cloudinary.uploader.upload(
            image,
            { public_id: uniqueImageName,  folder: "user images" }
        )
        const updatedImage = cloudinaryImageResult.secure_url  
        const updatedImagePublic_id = cloudinaryImageResult.public_id

        
        const updatedUserImage = await sql`
        UPDATE users 
        SET image = ${updatedImage}
        WHERE id = ${id}
        RETURNING users.image;
        `
        return Response.json({updated_name: updatedUserName, updated_image: updatedUserImage})
    
    } catch (error: any) {
        console.log(error.message)
        return Response.json({error: error.message})
    }
})
