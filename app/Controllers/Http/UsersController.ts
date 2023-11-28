import { v4 as uuidv4 } from "uuid";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "../../Models/User";

export default class UsersController {
  public async index({}: HttpContextContract) {
    return { message: "List all users" };
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.body().data;
      console.log(data);

      // TODO: Validate incoming data

      const id = uuidv4();

      // TODO: Hash/salt password

      const user = await User.create({ id, ...data }, {});
      return {
        code: 0,
        data: {
          id: user.id,
        },
      };
    } catch (err) {
      response.status(500);
      console.error("error:", err);
      return {
        code: err.errno,
        error: err.message,
      };
    }
  }

  public async show({ params }: HttpContextContract) {
    return {
      message: "Show single user",
      params,
    };
  }

  public async update({ params, request }: HttpContextContract) {
    return {
      message: "Update single user",
      params,
      body: request.body(),
    };
  }

  public async destroy({ params }: HttpContextContract) {
    return {
      message: "Destroy single user",
      params,
    };
  }

  public async auth({ request }: HttpContextContract) {
    return {
      message: "Authorize user",
      body: request.body(),
    };
  }
}
