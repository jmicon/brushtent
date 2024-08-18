import sql from "@/app/api/postgres"

export async function GET(req: Request) {
    try {
        const data = await sql`
        SELECT * FROM playing_with_neon
        `
        return Response.json(data)
        
    } catch (error: any) {
        return Response.json({error: error.message})
    }
}
