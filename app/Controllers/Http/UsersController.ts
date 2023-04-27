import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UsersController {
  public async index({ response, request }: HttpContextContract) {
    const roleId = request.role_id_mw;

    if (roleId !== 1) {
      return response.json({ message: "Access denied" });
    }

    const data = await User.query().preload("role").preload("blog");

    return response.json({ message: "lay thanh cong", data, status: 200 });
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.all();
    try {
      const token = await auth.attempt(email, password);
      return response.json({
        token,
        status: 200,
        message: "dang nhap thanh cong",
      });
    } catch (err) {
      return response.json({
        message: "dang nhap chua chinh xac",
        status: 404,
      });
    }
  }

  public async register_admin({ request, response }: HttpContextContract) {
    const { email, password, role_id } = request.all();
    console.log({ email, password, role_id });
    const user = await User.create({
      email,
      password,
      role_id,
    });

    return response.json({ message: "tao thanh cong", data: user });
  }
  public async register({ request, response }: HttpContextContract) {
    const { email, password } = request.all();

    const user = await User.create({
      email,
      password,
      role_id: 3,
    });
    if (!user)
      return response.json({
        message: "dang ki khong thanh cong",
        status: 404,
        data: user,
      });
    return response.json({
      message: "dang ki thanh cong",
      data: user,
      status: 200,
    });
  }

  public async delete({ params, response }: HttpContextContract) {
    const user = await User.query().where("id", params.id).first();

    if (!user) return response.json({ message: "khong tim thay user" });
    const data = await user.delete();
    return response.json({ message: "da xoa thanh cong", data });
  }

  public async level({ request, response, params }: HttpContextContract) {
    const role_id = request.role_id_mw;
    let message = "";
    const { level } = request.all(); // "level":"+"
    const user = await User.query().where("id", params.id).first();
    if (!user) return response.json({ message: "asdfsf" });
    if (role_id == 1 && user.role_id > 1) {
      if (level == "+") {
        await user.merge({ role_id: --user.role_id }).save();
        message = "nang quyen thanh cong";
      } else if (user.role_id == 2) {
        await user.merge({ role_id: ++user.role_id }).save();
        message = "giam quyen thanh cong";
      } else {
        message = "khong the giam duoc nua";
      }
    } else {
      message = "khong phai la admin, hoac nguoi bi thang dang la 1 admin";
    }
    return response.json({ message, data: user, status: 200 });
  }
}
