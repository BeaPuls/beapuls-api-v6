import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#user/models/user'
import Profile from '#profile/models/profile'
import { DateTime } from 'luxon'
import Gender, { GenderName } from '#profile/models/gender'

export default class extends BaseSeeder {
  async run() {
    const user = await User.create({
      email: 'test@test.com',
      password: 'password',
    })

    const gender = await Gender.findByOrFail({ name: GenderName.OTHER })

    await Profile.create({
      userId: user.id,
      username: 'UtilisateurTest',
      dateOfBirth: DateTime.fromISO('1990-01-01'),
      description: 'Ceci est un profil de test',
      genderId: gender.id,
    })
  }
}
