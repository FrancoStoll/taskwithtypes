import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { body, param } from "express-validator";
import { handleInputsErrors } from "../middleware/validation";
import { autheticate } from "../middleware/auth";

const router = Router();




router.post('/create-account',
  body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
  body('password').isLength({ min: 6 }).withMessage('El password debe tener almenos 6 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los password no son iguales')
    }
    return true

  }),
  body('email').isEmail().withMessage('El email no válido'),
  handleInputsErrors,
  AuthController.createAccount)

router.post('/confirm-account',

  body('token').notEmpty().withMessage('El token no puede ir vacio'),
  handleInputsErrors,
  AuthController.confirmAccount
)

router.post('/login',
  body('email').isEmail().withMessage('El email no válido'),
  body('password').notEmpty().withMessage('El password no puede ir vacio'),
  handleInputsErrors,
  AuthController.login
)


router.post('/request-code',
  body('email').isEmail().withMessage('El email no válido'),
  handleInputsErrors,
  AuthController.requestConfirmationCode
)

router.post('/forgot-password',
  body('email').isEmail().withMessage('El email no válido'),
  handleInputsErrors,
  AuthController.forgotPassword
)

router.post('/validate-token',
  body('token').notEmpty().withMessage('El token no puede ir vacio'),
  handleInputsErrors,
  AuthController.validateToken)

router.post('/update-password/:token',
  param('token').isNumeric().withMessage('Token no válido'),
  body('password').isLength({ min: 6 }).withMessage('El password debe tener almenos 6 caracteres'),
  body('password_confirmation').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Los password no son iguales')
    }
    return true

  }),
  handleInputsErrors,
  AuthController.updatePasswordWithToken)


  router.get('/user', autheticate, AuthController.user)


export default router