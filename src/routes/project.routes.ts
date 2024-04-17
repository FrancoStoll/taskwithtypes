import { Router } from "express";
import { ProjectController } from '../controller/ProjectController';
import { body, param } from "express-validator";
import { handleInputsErrors } from "../middleware/validation";
import { TaskController } from "../controller/TaskController";
import { validateProjectExist } from "../middleware/projects";
import { taskBelongsToProject, validateTaskExist } from "../middleware/task";
import { autheticate } from "../middleware/auth";
import { TeamMemberController } from "../controller/TeamController";

const router = Router();

// * Routes for project

router.use(autheticate)

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

router.param('projectId', validateProjectExist);
router.post('/:projectId/tasks',
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La description de la es obligatoria'),
  handleInputsErrors
  , TaskController.createTask)


router.get('/:projectId/tasks',
  TaskController.getProjectTasks
)

router.param('taskId', validateTaskExist)
router.param('taskId', taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no válido'),
  handleInputsErrors,
  TaskController.getTasksById
)
router.put('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La description de la es obligatoria'),
  handleInputsErrors,
  TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('ID no válido'),
  handleInputsErrors,
  TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('ID no válido'),
  body('status').notEmpty().withMessage('El estado es obligatorio'),
  handleInputsErrors,
  TaskController.updateTaskStatus
)


// Routes for team

router.post('/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('E-mail no válido'),
  handleInputsErrors,
  TeamMemberController.findMemberByEmail
)
router.get('/:projectId/team',
  TeamMemberController.getProjectTeam
)

router.post('/:projectId/team',
  body('id').isMongoId().withMessage('Id no válido'),
  handleInputsErrors,
  TeamMemberController.addMemberById
)

router.delete('/:projectId/team',
  body('id').isMongoId().withMessage('Id no válido'),
  handleInputsErrors,
  TeamMemberController.removeMemberById
)


export default router; 