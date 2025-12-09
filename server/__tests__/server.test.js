const request = require('supertest')

jest.mock('../db/task_db', () => ({
  getAllTasks: jest.fn(),
  getTask: jest.fn(),
  createTaskTable: jest.fn(),
  getMaxUid: jest.fn(),
  addTaskToDB: jest.fn(),
  updateTask: jest.fn(),
  updateStep: jest.fn(),
}))

const taskDb = require('../db/task_db')
const app = require('../server')

describe('task router', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET /test responds with hello world payload', async () => {
    const response = await request(app).get('/test')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ Test: 'Hello world' })
  })

  test('GET /api/task/all returns tasks from database layer', async () => {
    const tasks = [{ uid: 1, title: 'demo' }]
    taskDb.getAllTasks.mockReturnValue(tasks)

    const response = await request(app).get('/api/task/all')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(tasks)
    expect(taskDb.getAllTasks).toHaveBeenCalledTimes(1)
  })

  test('GET /api/task returns a single task by uid', async () => {
    const task = { uid: 2, title: 'single' }
    taskDb.getTask.mockReturnValue(task)

    const response = await request(app).get('/api/task').query({ uid: 2 })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(task)
    expect(taskDb.getTask).toHaveBeenCalledWith(2)
  })

  test('POST /api/task/new creates a task when payload is valid', async () => {
    taskDb.getMaxUid.mockReturnValue(-1)
    taskDb.addTaskToDB.mockReturnValue(true)

    const newTaskPayload = {
      title: 'New Task',
      priority: 1,
      steps: [
        { id: 1, value: 'step 1' },
        { id: 2, value: 'step 2' },
      ],
    }

    const response = await request(app).post('/api/task/new').send(newTaskPayload)

    expect(response.status).toBe(201)
    expect(taskDb.createTaskTable).toHaveBeenCalled()
    expect(taskDb.getMaxUid).toHaveBeenCalled()
    expect(taskDb.addTaskToDB).toHaveBeenCalledTimes(1)
    const savedTask = taskDb.addTaskToDB.mock.calls[0][0]
    expect(savedTask.title).toBe('New Task')
    expect(savedTask.priority).toBe(1)
    expect(savedTask.steps).toEqual(newTaskPayload.steps)
    expect(savedTask.uid).toBe(1)
  })

  test('POST /api/task/new rejects incomplete payloads', async () => {
    const response = await request(app).post('/api/task/new').send({ title: 'Missing data' })

    expect(response.status).toBe(400)
    expect(taskDb.addTaskToDB).not.toHaveBeenCalled()
  })

  test('PUT /api/task/updateTask updates tasks and steps', async () => {
    taskDb.updateTask.mockReturnValueOnce(1)
    taskDb.updateStep.mockReturnValue(1)
    taskDb.updateTask.mockReturnValueOnce(1)

    const response = await request(app)
      .put('/api/task/updateTask')
      .send({
        uid: 4,
        title: 'Updated title',
        priority: 2,
        status: 'Active',
        steps: [{ stepNumber: 1, stepValue: 'done' }],
      })

    expect(response.status).toBe(200)
    expect(taskDb.updateTask).toHaveBeenCalled()
    expect(taskDb.updateStep).toHaveBeenCalledWith(4, 1, 'done')
    expect(response.body).toEqual({ 'Updated rows': 3 })
  })
})
