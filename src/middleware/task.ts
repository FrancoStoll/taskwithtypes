import type { Request, Response, NextFunction } from 'express'
import Task, { ITask } from "../models/Task"


declare global {
  namespace Express {
    interface Request {
      task: ITask
    }
  }
}

export async function validateTaskExist(req: Request, res: Response, next: NextFunction) {


  try {
    const { taskId } = req.params

    const task = await Task.findById(taskId)

    if (!task) {
      const error = new Error('Esta tarea no se pudo verificar')
      return res.status(500).json({ error: error.message })
    }


    req.task = task
    next();

  } catch (error) {
    res.status(500).json({ error: 'Hubo un error' })
  }

}

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {

  if (req.task.project.toString() !== req.project.id.toString()) {
    const error = new Error('Accion no valida')
    return res.status(401).json({ error: error.message })
  }
  next();

}