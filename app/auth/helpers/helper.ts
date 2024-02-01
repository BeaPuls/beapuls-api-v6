import { JwtGuard, JwtGuardOptions } from '#auth/guards/jwt_guard';
import ApiToken from '#auth/models/api_token';
import { GuardConfigProvider } from '@adonisjs/auth/types';
import { UserProviderContract } from '@adonisjs/auth/types/core';
import { HttpContext } from '@adonisjs/core/http';
import { ConfigProvider } from '@adonisjs/core/types';
import { Exception } from '@poppinss/utils';
import { DateTime } from 'luxon';

/**
 * Helper function to configure the JwtGuard
 */
export function jwtGuard<UserProvider extends UserProviderContract<unknown>>(
  config: JwtGuardOptions & {
    provider: ConfigProvider<UserProvider>
  }
): GuardConfigProvider<(ctx: HttpContext) => JwtGuard<UserProvider>> {
  return {
    async resolver(_, app) {
      const provider = await config.provider.resolver(app)
      return (ctx) => {
        return new JwtGuard(ctx, provider, config)
      }
    },
  }
}

export function generateExpireAt() {
  let date = new Date()
  date.setDate(date.getDate() + 30)

  return date.toISOString()
}

export async function storeJwt(userId: number, jwtToken: string) {
  if (!userId || !jwtToken) {
    throw new Exception('Missing userId or token for store')
  }

  let tokenExist = await ApiToken.findBy('user_id', userId)

  let currentDate = new Date()
  let currentDateString = currentDate.toISOString().split('T')
  let todayDate = new Date(currentDateString[0])
  let tokenDate = new Date(tokenExist?.expireAt.toISODate())

  if (!tokenExist || todayDate >= tokenDate) {
    const expiresAt = generateExpireAt()
    let tokenStored = await ApiToken.updateOrCreate(
      {
        userId: userId,
      },
      {
        userId: userId,
        expireAt: DateTime.fromISO(expiresAt),
      }
    )
    return tokenStored.token.release()
  }
  return tokenExist.token.release()
}
