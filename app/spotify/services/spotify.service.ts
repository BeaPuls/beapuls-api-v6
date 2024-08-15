import AuthProviders from '#auth/models/auth_providers'
import User from '#user/models/user'
import env from '#start/env'
import axios from 'axios'

export const BASE_PATH = env.get('SPOTIFY_URL')

export default class SpotifyService {
  async getArtists(userId: User['id'], limit: 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    try {
      const resp = await axios.get(
        `${BASE_PATH}/me/top/artists?time_range=medium_term&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authProvider?.accessToken}`,
          },
        }
      )

      if (resp.status === 200) {
        return resp.data.items
      } else {
        throw new Error(`Unexpected status code: ${resp.status}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error('Unauthorized (401): Access to this resource requires authentication.')
          case 403:
            throw new Error('Forbidden (403): Access denied to this resource.')
          case 429:
            throw new Error(
              'Too Many Requests (429): Too many requests have been sent in a given amount of time.'
            )
          case 500:
            throw new Error(
              'Internal Server Error (500): The server encountered an unexpected condition.'
            )
          default:
            throw new Error(
              `Unhandled Error (HTTP ${error.response?.status}): ${error.response?.statusText}`
            )
        }
      } else {
        throw new Error('Error connecting to the Spotify service.')
      }
    }
  }

  async getTracks(userId: User['id'], limit: 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    try {
      const resp = await axios.get(
        `${BASE_PATH}/me/top/tracks?time_range=medium_term&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authProvider?.accessToken}`,
          },
        }
      )

      if (resp.status === 200) {
        return resp.data.items
      } else {
        throw new Error(`Unexpected status code: ${resp.status}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error('Unauthorized (401): Access to this resource requires authentication.')
          case 403:
            throw new Error('Forbidden (403): Access denied to this resource.')
          case 429:
            throw new Error(
              'Too Many Requests (429): Too many requests have been sent in a given amount of time.'
            )
          case 500:
            throw new Error(
              'Internal Server Error (500): The server encountered an unexpected condition.'
            )
          default:
            throw new Error(
              `Unhandled Error (HTTP ${error.response?.status}): ${error.response?.statusText}`
            )
        }
      } else {
        throw new Error('Error connecting to the Spotify service.')
      }
    }
  }

  async getAlbums(userId: User['id'], limit: 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    try {
      const resp = await axios.get(
        `${BASE_PATH}/me/top/albums?time_range=medium_term&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authProvider?.accessToken}`,
          },
        }
      )

      if (resp.status === 200) {
        return resp.data.items
      } else {
        throw new Error(`Unexpected status code: ${resp.status}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error('Unauthorized (401): Access to this resource requires authentication.')
          case 403:
            throw new Error('Forbidden (403): Access denied to this resource.')
          case 429:
            throw new Error(
              'Too Many Requests (429): Too many requests have been sent in a given amount of time.'
            )
          case 500:
            throw new Error(
              'Internal Server Error (500): The server encountered an unexpected condition.'
            )
          default:
            throw new Error(
              `Unhandled Error (HTTP ${error.response?.status}): ${error.response?.statusText}`
            )
        }
      } else {
        throw new Error('Error connecting to the Spotify service.')
      }
    }
  }

  async search(
    userId: User['id'],
    query: string,
    types: ('album' | 'artist' | 'track')[],
    limit: number = 5
  ) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    try {
      const resp = await axios.get(
        `${BASE_PATH}/search?q=${encodeURIComponent(query)}&type=${types.join(',')}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authProvider?.accessToken}`,
          },
        }
      )

      return resp.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error('Unauthorized (401): Access to this resource requires authentication.')
          case 403:
            throw new Error('Forbidden (403): Access denied to this resource.')
          case 429:
            throw new Error(
              'Too Many Requests (429): Too many requests have been sent in a given amount of time.'
            )
          case 500:
            throw new Error(
              'Internal Server Error (500): The server encountered an unexpected condition.'
            )
          default:
            throw new Error(
              `Unhandled Error (HTTP ${error.response?.status}): ${error.response?.statusText}`
            )
        }
      } else {
        throw new Error('Error connecting to the Spotify service.')
      }
    }
  }
}
