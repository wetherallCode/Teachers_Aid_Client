import { gql, useMutation } from '@apollo/client'
import React, { FC, useEffect, useState } from 'react'
import { useToggle } from '../../../../../hooks'
import {
  findTemporaryTasks_findTemporaryTasks_temporaryTasks,
  gradeTemporaryTask,
  gradeTemporaryTaskVariables,
} from '../../../../../schemaTypes'
import { MarkAbsent } from './MarkAbsent'
import { MarkComplete } from './MarkComplete'
import { useTemporaryTasksContextProvider } from './state-n-styles/TemporaryTasksContext'
import {
  TaskListData,
  TaskNameContainer,
} from './state-n-styles/temporaryTaskStyles'

export type TaskGraderProps = {
  task: findTemporaryTasks_findTemporaryTasks_temporaryTasks
  i: number
  absentStudentList?: findTemporaryTasks_findTemporaryTasks_temporaryTasks[]
}

export const GRADE_TEMPORARY_TASK_MUTATION = gql`
  mutation gradeTemporaryTask($input: GradeTemporaryTaskInput!) {
    gradeTemporaryTask(input: $input) {
      temporaryTask {
        _id
        student {
          firstName
        }
        answered
        studentPresent
      }
    }
  }
`

export const TaskGrader: FC<TaskGraderProps> = ({ task, i }) => {
  const [state, event] = useTemporaryTasksContextProvider()
  const [studentPresent, setStudentPresent] = useState(task.studentPresent)
  const [answered, setAnswered] = useToggle(task.answered)

  const [gradeTask] = useMutation<
    gradeTemporaryTask,
    gradeTemporaryTaskVariables
  >(GRADE_TEMPORARY_TASK_MUTATION, {
    variables: { input: { _id: task._id!, answered, studentPresent } },
    onCompleted: (data) => {},
    refetchQueries: [],
  })

  useEffect(() => {
    gradeTask()
  }, [studentPresent, answered])

  useEffect(() => {
    const [absentList] = state.context.absentList.filter(
      (i) => i.taskNumber === state.context.taskNumber - 2
    )

    if (absentList && absentList.tasks.includes(task.student._id!)) {
      setStudentPresent(false)
      !task.studentPresent &&
        event({
          type: 'ADD_TO_ABSENT_LIST',
          payload: {
            taskNumber: state.context.taskNumber - 1,
            studentIdToAdd: task.student._id!,
          },
        })
    }
  }, [state.context.taskNumber])

  return (
    <TaskListData i={i}>
      <MarkAbsent
        setStudentPresent={setStudentPresent}
        studentPresent={studentPresent}
        task={task}
      />
      <TaskNameContainer studentPresent={studentPresent}>
        {task.student.lastName}, {task.student.firstName}{' '}
        {studentPresent ? '' : '(Absent)'}
      </TaskNameContainer>
      <MarkComplete
        setAnswered={setAnswered}
        answered={task.answered}
        studentPresent={studentPresent}
      />
    </TaskListData>
  )
}
