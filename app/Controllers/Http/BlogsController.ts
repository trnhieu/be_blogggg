import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Blog from 'App/Models/Blog'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class BlogsController {

    public async index({ response }: HttpContextContract) {
        const data = await Blog.query().preload('user')
        return response.json({ data })
    }


    //****** DRAFT *********/

    public async createDraft({ request, response }: HttpContextContract) {
        const { title, content, image } = request.all()
        const user_id = request.user_id_mw
        // const filename = await this.uploadpicture(image)
        const data = await Blog.create({
            title,
            content,
            image,
            user_id,
            status: 1
        })

        return response.json({ message: 'da tao thanh cong', data })
    }

    public async uploadpicture({request,response}:HttpContextContract) {
        const image = request.file('image')
        if (!image) return response.status(400).json({message:"khong co hinh"})
        //day anh vao dir tmp/uploads
        const timestamp = new Date().getTime()
        const filename = `${timestamp}-${image.clientName}`
        await image.move(Application.tmpPath('uploads'), { name: filename })
        if (image.state !== "moved") {
            return response.status(400).json({message:"day khong thanh cong"})
        }
        return response.status(200).json({message:"thanh cong",data:filename})
    }



    public async readDraftByUser({ params, response, request }: HttpContextContract) {
        const userId = request.user_id_mw
        if (userId != params.id) return response.json({ message: 'khong dung nguoi dung', data: null })

        const data = await Blog.query().where('status', 1).where('user_id', params.id)

        return response.json(data)
    }

    // public async readDraft({  response, request }: HttpContextContract) {
    //     const userId = request.user_id_mw
    //     const roleId = request.role_id_mw
    //     if (roleId == 1) {
    //         const data = await Blog.query().where('status', 1)
    //         return response.json(data)

    //     }
    //     if (roleId == 2) {
    //         const data = await Blog.query()
    //             .join('users', 'user_id', '=', 'users.id')
    //             .whereIn('role_id', [2, 3])
    //             // .whereNotIn('users.id',[userId])
    //             .select('blogs.*')

    //         return response.json(data)
    //     }
    // }


    public async updateDraftByUser({ request, response, params }: HttpContextContract) {
        const userId = request.user_id_mw
        const blog = await Blog.query().where('id', params.id).firstOrFail()
        if (!blog) return response.json({ message: 'khong ton tai bai viet', data: null })
        if (blog.user_id != userId) return response.json({ message: 'vui long nhap dung tai khoan', data: null })
        const { title, content } = request.all()
        await blog.merge({ title, content }).save()
        return response.json({ message: 'cap nhat thanh cong', data: blog })
    }

    public async deleteDraftByUser({ request, response, params }: HttpContextContract) {

        const userId = request.user_id_mw
        const blog = await Blog.query().where('id', params.id).firstOrFail()

        if (!blog) return response.json({ message: 'khong ton tai bai viet', data: null })
        if (blog.user_id != userId) return response.json({ message: 'vui long nhap dung tai khoan', data: null })

        await blog.delete()
        return response.json({ message: 'xoa thanh cong' })
    }

    public async toPending({ params, response }: HttpContextContract) {
        const data = await Blog.query().where('id', params.id).firstOrFail()
        if (!data) return response.json({ message: "khong tim thay bai blog" })
        await data.merge({ status: 2 }).save()
        return response.json({ message: "da chuyen sang pendding" })

    }

    //********PENDDING********** */

    public async readPending({ request, response }: HttpContextContract) {
        const userId = request.user_id_mw
        const roleId = request.role_id_mw
        if (roleId == 1) {
            const data = await Blog.query().where('status', 2)
            return response.json(data)

        }
        if (roleId == 2) {
            const data = await Blog.query()
                .join('users', 'user_id', '=', 'users.id')
                .where('status', 2)
                .whereIn('role_id', [2, 3])
                .whereNotIn('users.id', [userId])
                .select('blogs.*')

            return response.json(data)
        }
    }


    public async approvePendding({ request, response, params }: HttpContextContract) {
        const roleId = request.role_id_mw
        const {status}  = request.all()
        const blog = await Blog.query().where('id', params.id).firstOrFail()

        if (!blog) return response.json({ message: 'khong tim thay blog nay' })
        const owner_role = blog.user.role_id

        if (owner_role == 1 || owner_role < roleId) return response.json({ message: 'khong co quyen' })
        
        await blog.merge({status}).save()
        return response.json({message:'da cap nhat xong'})
    }

    //********ACTIVE************ */
    // public async readActive({ params, request, response }: HttpContextContract) {

    // }
}
