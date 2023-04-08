import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
    public async index({ response }: HttpContextContract) {
        const user = await User.query().preload('role').preload('blog')
        return response.json({ user })
    }

    public async login({request,response,auth}:HttpContextContract){
        const {email, password} = request.all()
        try{
            const token = await auth.attempt(email,password)
            return response.json({token})
        }catch(err){
            return response.json({message:err})
        }
    }

    public async register_admin({ request, response }: HttpContextContract) {
        const { email, password, role_id } = request.all()
        console.log({email, password, role_id })
        const user = await User.create({
            email,
            password,
            role_id 
        })

        return response.json({message:"tao thanh cong", data: user })

    }
    public async register({ request, response }: HttpContextContract) {
        const { email, password } = request.all()

        const user = await User.create({
            email,
            password,
            role_id:3
        })
        return response.json({message:"tao thanh cong", data: user })
    }

    public async delete({ params, response }: HttpContextContract) {
        const user = await User.query().where('id',params.id).first()

        if(!user) return response.json({message:"khong tim thay user" })
        const data = await user.delete()
        return response.json({message:"da xoa thanh cong",data})
    }

    public async level({ request, response }: HttpContextContract) {
        const { id,role_id } = request.all()

        const user = await User.query().where('id',id).update({role_id}).first()
        return response.json({message:"update thanh cong", data: user })
    }

    
}