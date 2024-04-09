import type { Request, Response } from 'express'
import Project from "../models/Project"
import Task from "../models/Task"


export class TaskController {


  static createTask = async (req: Request, res: Response) => {



    try {

      const task = new Task(req.body)
      task.project = req.project._id

      req.project.tasks.push(task._id)


      await Promise.allSettled([task.save(), req.project.save()])
      res.send('Tarea creada correctamente')

    } catch (error) {
      console.log(error)
    }

  }

}