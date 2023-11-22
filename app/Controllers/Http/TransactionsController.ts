import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class TransactionsController {
  public async index({ params }: HttpContextContract) {
    return {
      message: `List all transactions for user with ID of ${params.userId}, account with ID of ${params.accountId}`,
    };
  }

  public async store({ params, request }: HttpContextContract) {
    return {
      message: `Create new transaction for user with ID of ${params.userId}, account with ID of ${params.accountId}`,
      body: request.body(),
    };
  }

  public async show({ params }: HttpContextContract) {
    return {
      message: "Show single transaction",
      params,
    };
  }

  public async update({ params, request }: HttpContextContract) {
    return {
      message: "Update single transaction",
      params,
      body: request.body(),
    };
  }

  public async destroy({ params }: HttpContextContract) {
    return {
      message: "Destroy single transaction",
      params,
    };
  }
}
