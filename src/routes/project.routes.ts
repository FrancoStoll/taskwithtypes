import { Router } from "express";
import { ProjectController } from '../controller/ProjectController';
import { body, param } from "express-validator";
import { handleInputsErrors } from "../middleware/validation";
import { TaskController } from "../controller/TaskController";
import { validateProjectExist } from "../middleware/projects";

const router = Router();

// * Routes for project

router.post('/',
  body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description').notEmpty().withMessage('la description es obligatoria'), handleInputsErrors,
  ProjectController.createProject)



router.get('/', ProjectController.getAllProjects)

router.get('/:id',
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputsErrors
  , ProjectController.getProjectById)


router.put('/:id',
  param('id').isMongoId().withMessage('ID no válido'),
  body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description').notEmpty().withMessage('la description es obligatoria'),
  handleInputsErrors,
  ProjectController.updateProject
)

router.delete('/:id',
  param('id').isMongoId().withMessage('ID no válido'),
  handleInputsErrors
  , ProjectController.deleteProject)




// * Routes for Tasks

router.post('/:projectId/tasks',
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La description de la es obligatoria'),
  handleInputsErrors,
  validateProjectExist
  , TaskController.createTask)

export default router; 