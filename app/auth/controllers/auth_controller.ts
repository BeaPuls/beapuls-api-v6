import { HttpContext } from "@adonisjs/core/http";

export default class AuthController {
  async create({ request, auth }: HttpContext) {
    // const data = request.body()
    // const output = await createAuthValidator.validate(data)
    // const token = await auth.use().attempt(output.email, output.password)
    // return token



    // const apiToken = await ApiToken.create(
    //   {
    //     userId: user.id,
    //     accessToken : new Secret(token.accessToken.release()),
    //     refreshToken : new Secret(token.refreshToken.release())
    //   }
    // )
    
  }
    
  async store({ request, auth, response }: HttpContext) {
    // const data = request.body()
    // const output = await storeAuthValidator.validate(data)

  
    // const user = await User.create({
    //   username: output.username,
    //   email: output.email,
    //   password: output.password
    // })
    
    // return response.created({
    //   status: true,
    //   data: user.toJSON(),
    //   message: "User registered successfully !"
    // })
  }
}