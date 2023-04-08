import { Response } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UserName {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const { email } = request.all()
    const data = await User.query().where('email', email).first()
    if (data) {
      return response.json({ error: "trung ten kia ma" })
    }
    await next()
  }
}
