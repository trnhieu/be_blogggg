import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class IsAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    // Authenticate the user
    await auth.use('api').authenticate();

    if (!auth.user) return response.json({ message: 'chua dang nhap kia ma' });
    const user = await User.query().where('id', auth.user.id).first();
    if (!user) return response.json({ message: 'khong tim thay user!!' });
    if (user.role_id != 1) return response.json({ message: "khong phai admin" })
    await next()
  }
}
