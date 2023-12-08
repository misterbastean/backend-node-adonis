import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "@Models/User";

export default class UsersController {
  public async index({ response }: HttpContextContract) {
    try {
      const users = await User.all();
      return { code: 0, data: users };
    } catch (err) {
      response.status(500);
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const data = request.body().data;

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
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id);
      if (user) {
        const data = request.body().data;

        // TODO: Validate data

        user.merge(data);
        await user.save();

        return {
          code: 0,
          data: {
            id: user.id,
          },
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
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.find(params.id);
      if (user) {
        user.deletedAt = DateTime.now().toISO();
        await user.save();
        return {
          code: 0,
          data: {
            id: user.id,
          },
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
      return {
        code: err.errno || 0,
        error: err.message,
      };
    }
  }

  public async auth({ request }: HttpContextContract) {
    return {
      message: "Authorize user",
      body: request.body(),
    };
  }
}
