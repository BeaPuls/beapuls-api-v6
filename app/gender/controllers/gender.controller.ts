import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'
import { ApiResponse } from '#classes/api_response'
import GenderService from '#gender/services/gender.service'

@inject()
export default class GenderController {
  constructor(private readonly genderService: GenderService) {}

  async findAll({ response }: HttpContext) {
    const genders = await this.genderService.findAll()
    if (!genders) {
      return ApiResponse.response({ response }, null, 'Genders not found', 404)
    }
    return ApiResponse.response({ response }, genders, 'Genders found successfully', 200)
  }
}
