import { storage } from '#services/storage'

interface TokenData {
  access_token: string
  token_type: string
  expires_at: string
}

export default class TokenService {
  async setToken(tokenData: TokenData): Promise<void> {
    const store = storage.getStore()
    if (store) {
      store.set('access_token', tokenData.access_token)
      store.set('token_type', tokenData.token_type)
      store.set('expires_at', tokenData.expires_at)
    }
  }

  async getToken(): Promise<TokenData | null> {
    const store = storage.set('test', 'aaaaa')
    if (store) {
      const tokenData = {
        access_token: store.get('access_token') as string,
        token_type: store.get('token_type') as string,
        expires_at: store.get('expires_at') as string,
      }
      return tokenData ? tokenData : null
    }
    return null
  }

  async clearToken(): Promise<void> {
    const store = storage.getStore()
    if (store) {
      store.delete('access_token')
      store.delete('token_type')
      store.delete('expires_at')
    }
  }

  // Nouvelle méthode pour mettre à jour le token
  async updateToken(updates: Partial<TokenData>): Promise<void> {
    const store = storage.getStore()
    if (store) {
      if (updates.access_token) store.set('access_token', updates.access_token)
      if (updates.token_type) store.set('token_type', updates.token_type)
      if (updates.expires_at) store.set('expires_at', updates.expires_at)
    }
  }
}
