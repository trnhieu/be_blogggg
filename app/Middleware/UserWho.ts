// app/Middleware/UserWho.ts

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UserWho {
  public async handle(
    { auth, response, request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    // Authenticate the user
    console.log("q");

    await auth.use("api").authenticate();

    if (!auth.user) return response.json({ message: "chua dang nhap kia ma" });

    const user = await User.query().where("id", auth.user.id).first();

    if (!user) return response.json({ message: "khong tim thay user!!" });

    const user_id = auth.user.id;

    const role_id = auth.user.role_id;

    request.user_id_mw = user_id;

    request.role_id_mw = role_id;
    console.log(user_id);

    console.log(user_id);
    await next();
  }
}
