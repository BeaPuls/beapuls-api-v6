import { HttpContext } from '@adonisjs/core/http'

export default class RoleAccessMiddleware {
  /**
   * Handle method to check user role and authorize access
   */
  async handle({ auth, response }: HttpContext, next: () => Promise<void>, allowedRoles: string[]) {
    // Ensure the user is authenticated
    await auth.authenticate()

    await auth.user?.load('roles')
    let roles: string[] = []
    auth.user?.roles.forEach((role: { name: string }) => {
      roles.push(role.name)
    })
    // Check if the user's role is in the allowed roles
    if (!roles.some((role) => allowedRoles.includes(role))) {
      return response.unauthorized({ message: 'Unauthorized access' })
    }

    // Call next to advance the request
    await next()
  }
}
