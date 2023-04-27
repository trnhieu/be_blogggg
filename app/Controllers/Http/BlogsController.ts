import Application from "@ioc:Adonis/Core/Application";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Blog from "App/Models/Blog";

export default class BlogsController {
  public async index({ response }: HttpContextContract) {
    const data = await Blog.query().preload("user");
    return response.json({ data });
  }

  //****** DRAFT *********/

  public async createDraft({ request, response }: HttpContextContract) {
    const { title, content, image, category_id } = request.all();
    const user_id = request.user_id_mw;
    // const filename = await this.uploadpicture(image)
    const data = await Blog.create({
      title,
      content,
      image,
      user_id,
      status: 1,
      category_id,
    });

    return response.json({ message: "da tao thanh cong", data, status: 200 });
  }

  public async uploadpicture({ request, response }: HttpContextContract) {
    const image = request.file("image");
    if (!image) return response.status(400).json({ message: "khong co hinh" });
    //day anh vao dir tmp/uploads
    const timestamp = new Date().getTime();
    const filename = `${timestamp}-${image.clientName}`;
    await image.move(Application.tmpPath("uploads"), { name: filename });
    if (image.state !== "moved") {
      return response.status(400).json({ message: "day khong thanh cong" });
    }
    return response.status(200).json({ message: "thanh cong", data: filename });
  }

  public async readDraftByUser({
    params,
    response,
    request,
  }: HttpContextContract) {
    const userId = request.user_id_mw;

    if (!userId)
      return response.json({ message: "khong co nguoi dung", data: null });

    const data = await Blog.query()
      .where("status", 1)
      .where("id", params.id)
      .preload("user")
      .preload("category")
      .first();
    if (data == null) return response.json({ error: "loi", status: 400, data });
    if (data!.user.id === userId) return response.json({ data, status: 200 });
    else return response.status(400).json({ error: "loi", status: 400, data });
  }

  public async readDraft({ response, request }: HttpContextContract) {
    //phan giai token, lay ra userid dang thuc hien
    const userId = request.user_id_mw;

    //lay ra toan bo ban draft cua user do
    const data = await Blog.query()
      .where("user_id", userId)
      .where("status", 1)
      .preload("user")
      .preload("category");

    if (data.length == 0)
      return response.json({ message: "khong co data", status: 404, data });
    return response.json({ message: "lay thanh cong", data, status: 200 });
  }

  public async updateDraftByUser({
    request,
    response,
    params,
  }: HttpContextContract) {
    const userId = request.user_id_mw;
    const blog = await Blog.query().where("id", params.id).firstOrFail();
    if (!blog)
      return response.json({
        message: "khong ton tai bai viet",
        data: null,
        status: 404,
      });
    if (blog.user_id != userId)
      return response.json({
        message: "vui long nhap dung tai khoan",
        data: null,
      });
    const { title, content, image, category_id } = request.all();
    await blog.merge({ title, content, image, category_id }).save();
    return response.json({
      message: "cap nhat thanh cong",
      data: blog,
      status: 200,
    });
  }

  public async deleteDraftByUser({
    request,
    response,
    params,
  }: HttpContextContract) {
    const userId = request.user_id_mw;
    const blog = await Blog.query().where("id", params.id).firstOrFail();

    if (!blog)
      return response.json({
        message: "khong ton tai bai viet",
        data: null,
        status: 404,
      });
    if (blog.user_id != userId)
      return response.json({
        message: "vui long nhap dung tai khoan",
        data: null,
        status: 401,
      });

    await blog.delete();
    return response
      .status(200)
      .json({ message: "xoa thanh cong", data: blog.id, status: 200 });
  }

  public async toPending({ params, response, request }: HttpContextContract) {
    const roleId = request.role_id_mw;
    const blog = await Blog.query().where("id", params.id).firstOrFail();
    if (!blog) return response.json({ message: "khong tim thay bai blog" });
    if (roleId == 1) {
      await blog.merge({ status: 3 }).save();
      return response.json({
        message: "da chuyen sang active",
        status: 200,
        blog,
      });
    }
    await blog.merge({ status: 2 }).save();
    return response.json({
      message: "da chuyen sang pendding",
      status: 200,
      blog,
    });
  }

  //********PENDDING********** */

  public async readPending({ request, response }: HttpContextContract) {
    const userId = request.user_id_mw;
    const roleId = request.role_id_mw;

    if (roleId == 1) {
      const data = await Blog.query()
        .where("status", 2)
        .preload("user")
        .preload("category");
      return response.json({ message: "lay thanh cong", data, status: 200 });
    }
    if (roleId == 2) {
      // const data = await Blog.query()
      //   .join("users", "user_id", "=", "users.id")
      //   .where("status", 2)
      //   .whereIn("role_id", [2, 3])
      //   .whereNotIn("users.id", [userId])
      //   .select("blogs.*")
      //   .preload("category")
      //   .preload("user");
      const data = await Blog.query()
        .join("users", "user_id", "=", "users.id")
        .where("status", 2)
        .whereIn("role_id", [3])
        .select("blogs.*")
        .preload("category")
        .preload("user");

      return response.json({ message: "lay thanh cong", data, status: 200 });
    }
  }

  public async approvePendding({
    request,
    response,
    params,
  }: HttpContextContract) {
    const roleId = request.role_id_mw;

    const { status } = request.all();

    const data = await Blog.query()
      .where("id", params.id)
      .preload("user")
      .firstOrFail();

    if (status != 3 && status != 4)
      return response.json({ message: "chi chuyen 3 va 4", data });

    if (!data) return response.json({ message: "khong tim thay blog nay" });

    const owner_role = data.user.role_id;

    if (owner_role == 1 || owner_role < roleId)
      return response.json({ message: "khong co quyen" });

    await data.merge({ status }).save();
    return response.json({ message: "da cap nhat xong", data });
  }

  // ********ACTIVE************
  public async readActive({ response }: HttpContextContract) {
    const data = await Blog.query()
      .where("status", 3)
      .preload("category")
      .preload("user");

    if (data.length === 0)
      return response.json({ message: "khong co blog", data, status: 401 });
    return response.json({ message: "lay thanh cong", data, status: 200 });
  }
}
