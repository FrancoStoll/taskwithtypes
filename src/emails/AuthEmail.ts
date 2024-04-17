import { transport } from "../config/nodemailer"


interface IEmail {
  email: string,
  name: string,
  token: string
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {

    const info = await transport.sendMail({
      from: 'Uptask <admin@uptask.com',
      to: user.email,
      subject: 'Uptask - Confirmar',
      text: 'Uptask confirma tu cuenta',
      html: `<p>hola: ${user.name}, has creado tu cuenta en uptask, solo debes confirmar tu cuenta</p>
        <p>Visita el siguente enlace</p>
        <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confrimar cuenta</a>    
        <p>E Ingresa el código: <b>${user.token}</b></p>
        <p>Este token expira en 10 minutos</p>
      `
    })


  }

  static sendPasswordResetToken = async (user: IEmail) => {

    const info = await transport.sendMail({
      from: 'Uptask <admin@uptask.com',
      to: user.email,
      subject: 'Uptask - Confirmar',
      text: 'Uptask reestaclece el password',
      html: `<p>hola: ${user.name}, has solicitado restablecer el password de tu cuenta en uptask/p>
        <p>Visita el siguente enlace</p>
        <a href="${process.env.FRONTEND_URL}/auth/new-password">Cambiar el password</a>    
        <p>E Ingresa el código: <b>${user.token}</b></p>
        <p>Este token expira en 10 minutos</p>
      `
    })


  }
}
