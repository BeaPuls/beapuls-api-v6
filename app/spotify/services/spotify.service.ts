import { inject } from '@adonisjs/core'
import AuthProviders from '#auth/models/auth_providers'
import env from '#start/env'
import User from '#user/models/user'
import axios from 'axios'
import { localStorage } from '#services/storage'

@inject()
export default class SpotifyService {
  private async getToken() {
    const clientId = env.get('SPOTIFY_CLIENT_ID')
    const clientSecret = env.get('SPOTIFY_CLIENT_SECRET')
    const authOptions = {
      url: env.get('SPOTIFY_TOKEN_URL'),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      },
      data: {
        grant_type: 'client_credentials',
      },
      json: true,
    }

    try {
      const response = await axios.post(authOptions.url ?? '', authOptions.data, {
        headers: authOptions.headers,
      })

      const expirationDate = new Date(Date.now() + response.data.expires_in * 1000)
      response.data.expires_at = expirationDate.toISOString()

      localStorage.setToken({
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        expires_at: response.data.expires_at,
      })

      return response.data.access_token
    } catch (error) {
      throw new Error("Impossible d'obtenir le token Spotify")
    }
  }

  private async refreshToken() {
    const url = env.get('SPOTIFY_TOKEN_URL')
    const token = localStorage.getToken()
    const refreshToken = token?.access_token

    try {
      const response = await axios.post(
        url ?? '',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken ?? '',
          client_id: env.get('SPOTIFY_CLIENT_ID'),
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      const expirationDate = new Date(Date.now() + response.data.expires_in * 1000)
      response.data.expires_at = expirationDate.toISOString()

      localStorage.updateToken({
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        expires_at: response.data.expires_at,
      })

      return response.data.access_token
    } catch (error) {
      throw new Error('Impossible de rafraîchir le token Spotify')
    }
  }

  private isTokenExpired(): boolean {
    const token = localStorage.getToken()
    if (!token || !token.expires_at) return false
    const expiresAt = new Date(token.expires_at).getTime()
    return expiresAt < Date.now()
  }

  async getArtists(userId: User['id'], limit: number = 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    try {
      const resp = await axios.get(
        `${env.get('SPOTIFY_URL')}/me/top/artists?time_range=medium_term&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authProvider?.accessToken}`,
          },
        }
      )

      if (resp.status === 200) {
        return resp.data.items
      } else {
        throw new Error(`Code de statut inattendu : ${resp.status}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error(
              "Non autorisé (401) : L'accès à cette ressource nécessite une authentification."
            )
          case 403:
            throw new Error('Interdit (403) : Accès refusé à cette ressource.')
          case 429:
            throw new Error(
              'Trop de requêtes (429) : Trop de requêtes ont été envoyées dans un laps de temps donné.'
            )
          case 500:
            throw new Error(
              'Erreur interne du serveur (500) : Le serveur a rencontré une condition inattendue.'
            )
          default:
            throw new Error(
              `Erreur non gérée (HTTP ${error.response?.status}) : ${error.response?.statusText}`
            )
        }
      } else {
        throw new Error('Erreur de connexion au service Spotify.')
      }
    }
  }

  async getTracks(userId: User['id'], limit: number = 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    try {
      const resp = await axios.get(
        `${env.get('SPOTIFY_URL')}/me/top/tracks?time_range=medium_term&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${authProvider?.accessToken}`,
          },
        }
      )

      if (resp.status === 200) {
        return resp.data.items
      } else {
        throw new Error(`Code de statut inattendu : ${resp.status}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error(
              "Non autorisé (401) : L'accès à cette ressource nécessite une authentification."
            )
          case 403:
            throw new Error('Interdit (403) : Accès refusé à cette ressource.')
          case 429:
            throw new Error(
              'Trop de requêtes (429) : Trop de requêtes ont été envoyées dans un laps de temps donné.'
            )
          case 500:
            throw new Error(
              'Erreur interne du serveur (500) : Le serveur a rencontré une condition inattendue.'
            )
          default:
            throw new Error(
              `Erreur non gérée (HTTP ${error.response?.status}) : ${error.response?.statusText}`
            )
        }
      } else {
        throw new Error('Erreur de connexion au service Spotify.')
      }
    }
  }

  async getAlbums(userId: User['id'], limit: number = 5) {
    const authProvider = await AuthProviders.query().where('user_id', userId).first()

    try {
      const resp = await axios.get(`${env.get('SPOTIFY_URL')}/me/albums?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${authProvider?.accessToken}`,
        },
      })

      if (resp.status === 200) {
        return resp.data.items
      } else {
        throw new Error(`Code de statut inattendu : ${resp.status}`)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error(
              "Non autorisé (401) : L'accès à cette ressource nécessite une authentification."
            )
          case 403:
            throw new Error('Interdit (403) : Accès refusé à cette ressource.')
          case 429:
            throw new Error(
              'Trop de requêtes (429) : Trop de requêtes ont été envoyées dans un laps de temps donné.'
            )
          case 500:
            throw new Error(
              'Erreur interne du serveur (500) : Le serveur a rencontré une condition inattendue.'
            )
          default:
            throw new Error(
              `Erreur non gérée (HTTP ${error.response?.status}) : ${error.response?.statusText}`
            )
        }
      } else {
        throw new Error('Erreur de connexion au service Spotify.')
      }
    }
  }

  async search(query: string, types: ('album' | 'artist' | 'track')[], limit: number = 5) {
    try {
      if (this.isTokenExpired()) {
        await this.refreshToken()
      } else {
        await this.getToken()
      }
      const token = localStorage.getToken()

      const resp = await axios.get(
        `${env.get('SPOTIFY_URL')}/search?q=${encodeURIComponent(query)}&type=${types.join(',')}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token?.access_token}`,
          },
        }
      )

      return resp.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 401:
            throw new Error(
              "Non autorisé (401) : L'accès à cette ressource nécessite une authentification."
            )
          case 403:
            throw new Error('Interdit (403) : Accès refusé à cette ressource.')
          case 429:
            throw new Error(
              'Trop de requêtes (429) : Trop de requêtes ont été envoyées dans un laps de temps donné.'
            )
          case 500:
            throw new Error(
              'Erreur interne du serveur (500) : Le serveur a rencontré une condition inattendue.'
            )
          default:
            throw new Error(
              `Erreur non gérée (HTTP ${error.response?.status}) : ${error.response?.statusText}`
            )
        }
      } else {
        throw new Error('Erreur de connexion au service Spotify.')
      }
    }
  }
}
