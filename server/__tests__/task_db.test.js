const path = require('path')
const fs = require('fs')

jest.mock('better-sqlite3', () => {
  return function InMemoryDatabase() {
    const rows = []

    class Statement {
      constructor(sql) {
        this.sql = sql
      }

      run(params) {
        if (this.sql.startsWith('CREATE TABLE')) {
          return { changes: 0 }
        }

        if (this.sql.startsWith('INSERT INTO Tasks')) {
          rows.push({ ...params })
          return { changes: 1 }
        }

        if (this.sql.includes('SET stepValue')) {
          let changes = 0
          rows.forEach((row) => {
            if (row.uid === params.uid && row.stepNumber === params.stepNumber) {
              row.stepValue = params.stepValue
              changes += 1
            }
          })
          return { changes }
        }

        if (this.sql.startsWith('UPDATE Tasks')) {
          let changes = 0
          rows.forEach((row) => {
            if (row.uid === params.uid) {
              if (params.title !== undefined) row.title = params.title
              if (params.priority !== undefined) row.priority = params.priority
              if (params.status !== undefined) row.status = params.status
              if (params.dateDisplay !== undefined) row.lastModifiedDateToDisplay = params.dateDisplay
              if (params.dateTimestamp !== undefined) row.lastModifiedDateTimeStamp = params.dateTimestamp
              changes += 1
            }
          })
          return { changes }
        }

        return { changes: 0 }
      }

      all(params) {
        if (this.sql.startsWith('SELECT MAX(uid)')) {
          const maxUid = rows.reduce((max, row) => (row.uid > max ? row.uid : max), -Infinity)
          return [{ maxUid: maxUid === -Infinity ? null : maxUid }]
        }

        if (this.sql.startsWith('SELECT uid,title')) {
          if (this.sql.includes('WHERE uid = ?')) {
            const uid = Array.isArray(params) ? params[0] : params.uid
            return rows.filter((row) => row.uid === uid).map((row) => ({
              uid: row.uid,
              title: row.title,
              priority: row.priority,
              status: row.status,
              dateToDisplay: row.dateToDisplay,
              dateTimeStamp: row.dateTimeStamp,
              lastModifiedDateToDisplay: row.lastModifiedDateToDisplay,
              lastModifiedDateTimeStamp: row.lastModifiedDateTimeStamp,
            }))
          }

          return rows.map((row) => ({
            uid: row.uid,
            title: row.title,
            priority: row.priority,
            status: row.status,
            dateToDisplay: row.dateToDisplay,
            dateTimeStamp: row.dateTimeStamp,
            lastModifiedDateToDisplay: row.lastModifiedDateToDisplay,
            lastModifiedDateTimeStamp: row.lastModifiedDateTimeStamp,
          }))
        }

        if (this.sql.startsWith('SELECT stepNumber,stepValue FROM Tasks WHERE uid = ?')) {
          const uid = Array.isArray(params) ? params[0] : params.uid
          return rows
            .filter((row) => row.uid === uid)
            .map((row) => ({ stepNumber: row.stepNumber, stepValue: row.stepValue }))
        }

        if (this.sql.startsWith('SELECT uid,stepNumber,stepValue FROM Tasks')) {
          return rows.map((row) => ({ uid: row.uid, stepNumber: row.stepNumber, stepValue: row.stepValue }))
        }

        if (this.sql.startsWith('PRAGMA table_info')) {
          return []
        }

        return rows
      }

      get(params) {
        const results = this.all(params)
        return Array.isArray(results) ? results[0] : results
      }
    }

    return {
      prepare: (sql) => new Statement(sql),
    }
  }
})

describe('task database helpers', () => {
  let taskDb

  const buildTask = (overrides = {}) => ({
    uid: 1,
    title: 'Task title',
    priority: 2,
    steps: [
      { id: 1, value: 'First step' },
      { id: 2, value: 'Second step' },
    ],
    status: 'Active',
    dateToDisplay: '2025-01-01',
    dateTimeStamp: 1,
    lastModifiedDateToDisplay: '2025-01-01',
    lastModifiedDateTimeStamp: 1,
    ...overrides,
  })

  beforeEach(() => {
    jest.resetModules()
    const dbPath = path.join(__dirname, 'test-db.sqlite')
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath)
    }
    process.env.DB_PATH = dbPath
    process.env.NODE_ENV = 'test'
    taskDb = require('../db/task_db')
    taskDb.createTaskTable()
  })

  test('getMaxUid returns -1 when table is empty', () => {
    expect(taskDb.getMaxUid()).toBe(-1)
  })

  test('addTaskToDB stores tasks and steps for retrieval', async () => {
    const task = buildTask()
    await taskDb.addTaskToDB(task)

    const stored = taskDb.getTask(1)
    expect(stored.title).toBe('Task title')
    expect(stored.steps).toHaveLength(2)
    expect(stored.steps.map((step) => step.stepValue)).toEqual(['First step', 'Second step'])
  })

  test('getAllTasks returns distinct tasks with steps', async () => {
    await taskDb.addTaskToDB(buildTask())
    await taskDb.addTaskToDB(buildTask({ uid: 2, title: 'Another', steps: [{ id: 1, value: 'Only step' }] }))

    const allTasks = taskDb.getAllTasks()
    const titles = allTasks.map((task) => task.title)

    expect(allTasks).toHaveLength(2)
    expect(titles).toEqual(expect.arrayContaining(['Task title', 'Another']))
    expect(allTasks.find((task) => task.uid === 2).steps[0].stepValue).toBe('Only step')
  })

  test('updateStep and updateTask modify stored rows', async () => {
    await taskDb.addTaskToDB(buildTask())

    const updatedRows = taskDb.updateStep(1, 1, 'Updated step')
    const taskUpdateRows = taskDb.updateTask({
      uid: 1,
      title: 'Updated title',
      priority: 3,
      status: 'Completed',
      lastModifiedDateToDisplay: '2025-01-02',
      lastModifiedDateTimeStamp: 2,
    })

    const updated = taskDb.getTask(1)
    expect(updatedRows).toBeGreaterThanOrEqual(0)
    expect(taskUpdateRows).toBeGreaterThanOrEqual(0)
    expect(updated.title).toBe('Updated title')
    expect(updated.steps[0].stepValue).toBe('Updated step')
    expect(updated.status).toBe('Completed')
  })
})
