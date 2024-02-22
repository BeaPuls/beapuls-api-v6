import AuthProviders from '#auth/models/auth_providers'
import User from '#models/user'
import env from '#start/env'
import axios from 'axios'

export const BASE_PATH = env.get('SPOTIFY_URL').replace(/\/+$/, '')

export default class SpotifyService {
  async getArtists(userId: User['id'], limit: 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    const resp = await axios.get(
      `${BASE_PATH}/me/top/artists?time_range=medium_term&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${authProvider?.accessToken}`,
        },
      }
    )

    return resp?.data?.items
  }

  async getTracks(userId: User['id'], limit: 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    const resp = await axios.get(
      `${BASE_PATH}/me/top/tracks?time_range=medium_term&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${authProvider?.accessToken}`,
        },
      }
    )

    return resp?.data?.items
  }

  async getAlbums(userId: User['id'], limit: 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    const resp = await axios.get(
      `${BASE_PATH}/me/top/tracks?time_range=medium_term&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${authProvider?.accessToken}`,
        },
      }
    )

    return resp?.data?.items
  }
}
