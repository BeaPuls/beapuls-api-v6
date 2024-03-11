// import User from '#models/user'
// import Profile from '#profile/models/profile'
// import env from '#start/env'
// import { inject } from '@adonisjs/fold'

// @inject()
// export default class UserService {
//   private serializeProfileToShow(profile: Profile) {
//     return {
//       user: {
//         id: profile.user.id,
//         name: profile.user.name,
//         image: this.buildUserAvatarUrl(profile.user.id),
//       },
//       tracks: profile.user.tracks,
//     }
//   }

//   private buildUserAvatarUrl(userId: User['id']) {
//     // TODO url endpoint need to be create
//     return `${env.get('BASE_API_URL')}/users/${userId}/avatar`
//   }

//   async getProfilesToShowForProfile(profile: Profile) {
//     // TODO add localisation feature
//     const profiles = await Profile.query()
//       .whereNot('id', profile.id)
//       .preload('user', (q: any) => {
//         q.preload('tracks')
//       })

//     return profiles.map((_profile: Profile) => {
//       return this.serializeProfileToShow(_profile)
//     })
//   }
// }
