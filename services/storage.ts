import { LocalStorage } from 'node-localstorage'
import * as path from 'node:path'

interface TokenData {
  access_token: string
  token_type: string
  expires_at: string
}

class Storage {
  private storage: LocalStorage

  constructor() {
    const storagePath = path.join(process.cwd(), '.localStorage')
    this.storage = new LocalStorage(storagePath)
  }

  set(key: string, value: any): void {
    this.storage.setItem(key, JSON.stringify(value))
  }

  get(key: string): any {
    const value = this.storage.getItem(key)
    return value ? JSON.parse(value) : undefined
  }

  setToken(tokenData: TokenData): void {
    this.set('access_token', tokenData.access_token)
    this.set('token_type', tokenData.token_type)
    this.set('expires_at', tokenData.expires_at)
  }

  getToken(): TokenData | null {
    const accessToken = this.get('access_token')
    const tokenType = this.get('token_type')
    const expiresAt = this.get('expires_at')

    if (accessToken && tokenType && expiresAt) {
      return { access_token: accessToken, token_type: tokenType, expires_at: expiresAt }
    }
    return null
  }

  clearToken(): void {
    this.storage.removeItem('access_token')
    this.storage.removeItem('token_type')
    this.storage.removeItem('expires_at')
  }

  updateToken(updates: Partial<TokenData>): void {
    if (updates.access_token) this.set('access_token', updates.access_token)
    if (updates.token_type) this.set('token_type', updates.token_type)
    if (updates.expires_at) this.set('expires_at', updates.expires_at)
  }
}

export const localStorage = new Storage()
