import { v4 as uuidv4 } from "uuid";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "../../Models/User";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all();
      return { code: 0, data: users };
    } catch (err) {
      response.status(500);
      console.error("error:", err);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
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
        code: err.errno || 0,
        error: err.message,
      };
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id);
      if (user) {
        return {
          code: 0,
          data: user,
        };
      } else {
        response.status(404);
        return {
          code: 0,
          data: null,
        };
      }
    } catch (err) {
      response.status(500);
      console.error("error:", err);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
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
