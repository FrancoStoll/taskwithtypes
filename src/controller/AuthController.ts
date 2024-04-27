import type { Request, Response } from 'express'
import User from "../models/User"
import { checkPassword, hashPassword } from "../utils/auth"
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"
export class AuthController {

  static createAccount = async (req: Request, res: Response) => {

    try {

      const userExist = await User.findOne({ email: req.body.email })

      if (userExist) {
        const error = new Error('Usuario ya registrado')
        return res.status(409).json({ error: error.message })
      }



      const user = new User(req.body)

      // Hash password
      user.password = await hashPassword(req.body.password)



      // Generar token
      const token = new Token()
      token.token = generateToken();
      token.user = user.id

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      })
      await Promise.allSettled([user.save(), token.save()])

      // ENVIAR EL EMAIL


      res.send('Cuenta creada, revista tu email para confirmalo')

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }

  }

  static confirmAccount = async (req: Request, res: Response) => {

    const { token } = req.body

    try {

      const tokenExist = await Token.findOne({ token: token })

      if (!tokenExist) {
        const error = new Error('Token no valido')
        return res.status(404).json({ error: error.message })
      }

      const user = await User.findById(tokenExist.user)
      user.confirmed = true


      await Promise.allSettled([user.save(), tokenExist.deleteOne()])

      res.send('Cuenta confirmada correctamente, ya puedes iniciar sesión en UpTask')

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static login = async (req: Request, res: Response) => {

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({ error: error.message })
      }
      // enviar email
      if (!user.confirmed) {
        const token = new Token()
        token.user = user.id
        token.token = generateToken();
        token.save()

        AuthEmail.sendConfirmationEmail({
          email: email,
          name: user.name,
          token: token.token
        })

        const error = new Error('Usuario no confirmado, revisa tu email para confirmarlo')
        return res.status(401).json({ error: error.message })
      }
      // revisar password

      const isPasswordCorrect = await checkPassword(password, user.password)

      if (!isPasswordCorrect) {
        const error = new Error('Revisa tu password')
        return res.status(401).json({ error: error.message })
      }

      const token = generateJWT({
        id: user.id
      });

      res.send(token)

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static requestConfirmationCode = async (req: Request, res: Response) => {

    try {
      const { email } = req.body;

      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('Usuario no esta registrado')
        return res.status(404).json({ error: error.message })
      }
      if (user.confirmed) {
        const error = new Error('Usuario ya confirmado')
        return res.status(403).json({ error: error.message })
      }

      // Generar token
      const token = new Token()
      token.user = user.id
      token.token = generateToken()

      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token
      })

      token.save()
      res.send('Se envio un nuevo codigo')

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }


  static forgotPassword = async (req: Request, res: Response) => {

    try {
      const { email } = req.body;

      const user = await User.findOne({ email })
      if (!user) {
        const error = new Error('Usuario no esta registrado')
        return res.status(404).json({ error: error.message })
      }

      // Generar token
      const token = new Token()
      token.user = user.id
      token.token = generateToken()

      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token
      })



      token.save()
      res.send('Se envio un nuevo codigo, revisa tu email')

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static validateToken = async (req: Request, res: Response) => {

    const { token } = req.body

    try {

      const tokenExist = await Token.findOne({ token: token })

      if (!tokenExist) {
        const error = new Error('Token no valido')
        return res.status(404).json({ error: error.message })
      }



      res.send('Token válido, Define tu nuevo password')

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static updatePasswordWithToken = async (req: Request, res: Response) => {



    try {

      const { token } = req.params
      const tokenExist = await Token.findOne({ token: token })

      if (!tokenExist) {
        const error = new Error('Token no valido')
        return res.status(404).json({ error: error.message })
      }

      const user = await User.findById(tokenExist.user)

      user.password = await hashPassword(req.body.password)

      await Promise.allSettled([user.save(), tokenExist.deleteOne()])


      res.send('El password se guardo con exito')

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }


  static user = async (req: Request, res: Response) => {


    return res.json(req.user)

  }


  static uodateProfile = async (req: Request, res: Response) => {

    const { name, email } = req.body

    const userExist = await User.findOne({ email });
    if (userExist && userExist.id.toString() !== req.user.id.toString()) {
      const error = new Error('Ese email ya está en uso')
      return res.status(409).json({ error: error.message })
    }

    req.user.name = name
    req.user.email = email


    try {
      await req.user.save()
      res.send('Perfil Actualizado')
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static updateCurrentUserPassword = async (req: Request, res: Response) => {

    const { current_password, password } = req.body

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(current_password, user.password)

    if (!isPasswordCorrect) {
      const error = new Error('Tu password actual es incorrecta')
      return res.status(409).json({ error: error.message })
    }

    user.password = await hashPassword(password)

    try {
      await user.save()
      res.send('El password se cambio exitosamente!!')
    } catch (error) {
      return res.status(500).json({ error: error.message })
    }

  }

  static checkPassword = async (req: Request, res: Response) => {

    const { password } = req.body

    const user = await User.findById(req.user.id);

    const isPasswordCorrect = await checkPassword(password, user.password)

    if (!isPasswordCorrect) {
      const error = new Error('Tu password actual es incorrecta')
      return res.status(409).json({ error: error.message })
    }



    res.send('Password Correcto');
  }

}