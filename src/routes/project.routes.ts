import { Router } from "express";
import { ProjectController } from '../controller/ProjectController';
import { body, param } from "express-validator";
import { handleInputsErrors } from "../middleware/validation";
import { TaskController } from "../controller/TaskController";
import { validateProjectExist } from "../middleware/projects";
import { hasAuthorization, taskBelongsToProject, validateTaskExist } from "../middleware/task";
import { autheticate } from "../middleware/auth";
import { TeamMemberController } from "../controller/TeamController";
import { NoteController } from "../controller/NoteController";

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

// * Routes for Tasks

router.param('projectId', validateProjectExist);

router.put('/:projectId',
  param('projectId').isMongoId().withMessage('ID no válido'),
  body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
  body('description').notEmpty().withMessage('la description es obligatoria'),
  handleInputsErrors,
  hasAuthorization,
  ProjectController.updateProject
)

router.delete('/:projectId',
  param('projectId').isMongoId().withMessage('ID no válido'),
  handleInputsErrors,
  hasAuthorization
  , ProjectController.deleteProject)





router.post('/:projectId/tasks',
  hasAuthorization,
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
  hasAuthorization,
  param('taskId').isMongoId().withMessage('ID no válido'),
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La description de la es obligatoria'),
  handleInputsErrors,
  TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
  hasAuthorization,
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

router.delete('/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('Id no válido'),
  handleInputsErrors,
  TeamMemberController.removeMemberById
)


// Routes for Notes
router.post('/:projectId/tasks/:taskId/notes',
  body('content').notEmpty().withMessage('El contenido de la nota es obligatorio'),
  handleInputsErrors,
  NoteController.createNote
)
router.get('/:projectId/tasks/:taskId/notes',
  NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  param('noteId').isMongoId().withMessage('ID no válido'),
  handleInputsErrors,
  NoteController.deleteTaskNote
)

export default router; 