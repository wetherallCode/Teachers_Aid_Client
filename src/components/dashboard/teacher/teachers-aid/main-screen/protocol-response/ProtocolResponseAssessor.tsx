import React, { FC, useState } from 'react'
import {
  assessStudentProtocol,
  assessStudentProtocolVariables,
  ProtocolActivityTypes,
  ProtocolAssessmentEnum,
  MarkingPeriodEnum,
} from '../../../../../../schemaTypes'
import { useMutation } from '@apollo/client'
import { ASSESS_PROTOCOL_MUTATION } from '../../student-info/protocols/AssessProtocol'

export type ProtocolResponseAssessorProps = {
  response: {
    studentName: string
    response: string
    studentId: string
    assignedDate: string
    task: string
    protocolActivityType: ProtocolActivityTypes
    markingPeriod: MarkingPeriodEnum
  }
  i: number
}

export const ProtocolResponseAssessor: FC<ProtocolResponseAssessorProps> = ({
  response,
  i,
}) => {
  const [assessProtocol] = useMutation<
    assessStudentProtocol,
    assessStudentProtocolVariables
  >(ASSESS_PROTOCOL_MUTATION, {
    onCompleted: (data) => console.log(data),
    refetchQueries: ['findVirtualResponses'],
  })
  return (
    <>
      <div>
        <button
          style={{ backgroundColor: 'var(--red)', color: 'var(--white)' }}
          onClick={() =>
            assessProtocol({
              variables: {
                input: {
                  studentId: response.studentId,
                  assignedDate: response.assignedDate,
                  protocolActivityType: response.protocolActivityType,
                  task: response.task,
                  assessment: ProtocolAssessmentEnum.WORKED_WELL,
                  markingPeriod: response.markingPeriod,
                },
              },
            })
          }
        >
          Good Job
        </button>
        <button
          style={{ backgroundColor: 'var(--blue)', color: 'var(--white)' }}
          onClick={() =>
            assessProtocol({
              variables: {
                input: {
                  studentId: response.studentId,
                  assignedDate: response.assignedDate,
                  protocolActivityType: response.protocolActivityType,
                  task: response.task,
                  assessment: ProtocolAssessmentEnum.WORKED_VERY_WELL,
                  markingPeriod: response.markingPeriod,
                },
              },
            })
          }
        >
          Great Job
        </button>
        <div>
          {i + 1}: {response.studentName}: {response.response}
        </div>
      </div>
    </>
  )
}
