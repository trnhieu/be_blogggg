import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Role from "App/Models/Role";

export default class RolesController {
  public async store({ request, response }: HttpContextContract) {
    const { name } = request.all();
    const data = await Role.create({ name });
    return response.json({ data });
  }
  public async index({ response }: HttpContextContract) {
    const data = await Role.query().preload("users");
    return response.json({ message: "lay toan bo thanh cong", data });
  }
}
