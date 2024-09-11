import { inject } from '@adonisjs/core'
import Gender from '#gender/models/gender'

@inject()
export default class GenderService {
  async findAll() {
    return await Gender.all()
  }
}
