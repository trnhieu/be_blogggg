import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Category from "App/Models/Category";

export default class CategoriesController {
  public async index({ response }: HttpContextContract) {
    const data = await Category.query().preload("blogs");
    return response.json({ message: "lay thanh cong", data });
  }
  public async store({ response, request }: HttpContextContract) {
    const { name } = request.all();
    const data = await Category.create({ name });
    return response.json({ message: "them thanh cong", data });
  }
}
