import type { Request, Response } from 'express'
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


  static getProjectTasks = async (req: Request, res: Response) => {

    try {

      const tasks = await Task.find({ project: req.project.id }).populate('project')
      res.json(tasks)

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }


  static getTasksById = async (req: Request, res: Response) => {
    try {

      const task = await Task.findById(req.task.id).populate({
        path: 'completedBy.user', select: 'id name email'
      }).populate({ path: 'notes', populate: { path: 'createdBy', select: 'id name email' } })

      res.json(task)

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }


  static updateTask = async (req: Request, res: Response) => {
    try {

      req.task.name = req.body.name
      req.task.description = req.body.description
      await req.task.save()

      res.json("tarea actualizada correctamente")
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Hubo un errora' })
    }
  }


  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString())

      await Promise.allSettled([req.task.deleteOne(), req.project.save()])

      res.json("tarea eliminada correctamente")
    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }
  }

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body
      const data = {
        user: req.user.id,
        status: status
      }
      req.task.status = status

      req.task.completedBy.push(data)

      await req.task.save()
      res.send('Tarea actualizada')

    } catch (error) {
      res.status(500).json({ error: 'Hubo un error' })
    }

  }
}