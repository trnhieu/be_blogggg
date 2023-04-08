import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {

    await auth.use('api').authenticate()
    if (!auth.user) return response.json({ message: 'chua dang nhap kia ma' })

    const user = await User.query().where('id', auth.user.id).first()
    if (!user) return response.json({ message: 'khong tim thay user, may ao ma a!!' })

    if (user.role_id == 1)
      await next()
    else return response.status(401).json({ message: 'ban khong co quyen' })
  }
}
