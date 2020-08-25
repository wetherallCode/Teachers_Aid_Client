import React, { FC, useState, useEffect } from 'react'
import { useTeachersAidContextProvider } from '../state/TeachersAidContext'
import { gql, useQuery } from '@apollo/client'
import {
  findVirtualResponses,
  findVirtualResponsesVariables,
} from '../../../../../schemaTypes'

export type VirtualProtocolResponseProps = {}
export const VIRTUAL_RESPONSE_QUERY = gql`
  query findVirtualResponses($input: FindCourseInfoByCourseIdInput!) {
    findCourseInfoByCourseId(input: $input) {
      courseInfo {
        course {
          hasLessons {
            duringActivities {
              isActive
            }
          }
          hasStudents {
            hasProtocols {
              _id
              student {
                _id
                firstName
                lastName
              }
              isActive
              response
            }
          }
        }
      }
    }
  }
`
export const VirtualProtocolResponse: FC<VirtualProtocolResponseProps> = () => {
  const [state, event] = useTeachersAidContextProvider()
  const [responseList, setResponseList] = useState<
    { studentName: string; response: string }[]
  >([])

  const { loading, data } = useQuery<
    findVirtualResponses,
    findVirtualResponsesVariables
  >(VIRTUAL_RESPONSE_QUERY, {
    variables: {
      input: { courseId: state.context.courseInfo.course._id! },
    },
    onCompleted: (data) => console.log(data),
    pollInterval: 1000,
    onError: (error) => console.error(error),
  })
  console.log(
    data?.findCourseInfoByCourseId.courseInfo.course.hasLessons.some((lesson) =>
      lesson.duringActivities.some((activity) => activity.isActive)
    )
  )

  useEffect(() => {
    if (
      data?.findCourseInfoByCourseId.courseInfo.course.hasLessons.some(
        (lesson) =>
          lesson.duringActivities.some((activity) => activity.isActive)
      )
    ) {
      const studentProtocols = data?.findCourseInfoByCourseId.courseInfo.course.hasStudents.map(
        (student) =>
          student.hasProtocols.filter((protocol) => protocol.isActive)
      )
      console.log(studentProtocols)
      for (const response of studentProtocols) {
        for (const value of response) {
          if (value.response) {
            setResponseList([
              ...responseList,
              {
                studentName: `${value.student.lastName}, ${value.student.firstName}`,
                response: value.response!,
              },
            ])
          }
        }
      }
    } else setResponseList([])
  }, [data?.findCourseInfoByCourseId.courseInfo.course.hasLessons])

  if (loading) return <div>Loading </div>
  return (
    <>
      <div>
        {responseList.map((response, i: number) => (
          <div key={i}>
            {i + 1}: {response.studentName}: {response.response}
          </div>
        ))}
      </div>
    </>
  )
}