import React, { FC } from 'react'
import {
  PeriodSelectDisplayContainer,
  ProtocolManagerContainer,
  DynamicLessonContainer,
  CenteredDiv,
  MainScreenManagerContainer,
} from '../../styles/classControlPanelStyles'
import { useTeachersAidContextProvider } from '../../state/TeachersAidContext'
import { PeriodSelectorDisplay } from './PeriodSelectorDisplay'
import { ProtocolManager } from '../protocol-manager/ProtocolManager'
import { DynamicLessonManager } from '../DynamicLesson/DynamicLessonManager'
import {
  findLessonByCourseAndDate,
  findLessonByCourseAndDateVariables,
} from '../../../../../../schemaTypes'

import { date } from '../../../../../../utils'
import { useQuery } from '@apollo/client'
import { FIND_LESSON_QUERY } from '../../../../../lesson/LessonMainMenu'
import { MainScreenManager } from './MainScreenManager'

export type ControlPanelDisplayProps = {}

export const ControlPanelDisplay: FC<ControlPanelDisplayProps> = () => {
  const [state, event] = useTeachersAidContextProvider()
  // console.log(state.value)
  const { loading, data } = useQuery<
    findLessonByCourseAndDate,
    findLessonByCourseAndDateVariables
  >(FIND_LESSON_QUERY, {
    variables: {
      input: {
        courseId: state.context.courseInfo.course._id!,
        lessonDate: date,
      },
    },
    onCompleted: (data) => {
      data.findLessonByCourseAndDate.lesson &&
        event({
          type: 'LOAD_PROTOCOLS',
          payload: data.findLessonByCourseAndDate.lesson.duringActivities,
        })
      data.findLessonByCourseAndDate.lesson &&
        event({
          type: 'SET_LESSON_ID',
          payload: data.findLessonByCourseAndDate.lesson._id!,
        })
    },
    onError: (error) => console.error(error),
  })

  if (loading)
    return (
      <CenteredDiv>
        <div>No Lesson Scheduled for Today</div>
      </CenteredDiv>
    )

  return (
    <>
      {state.matches('controlPanelActions.dynamicLesson') &&
        state.context.courseInfo._id &&
        !state.context.courseSelectVisible && (
          <>
            {data?.findLessonByCourseAndDate.lesson ? (
              <DynamicLessonManager
                lesson={data?.findLessonByCourseAndDate.lesson!}
              />
            ) : (
              <CenteredDiv>
                <div>No Lesson Scheduled for Today</div>
              </CenteredDiv>
            )}
          </>
        )}
      {state.matches('controlPanelActions.protocolManager')! &&
        state.context.courseInfo._id &&
        !state.context.courseSelectVisible && (
          <>
            {data?.findLessonByCourseAndDate.lesson ? (
              <>
                <ProtocolManager
                  protocols={
                    data?.findLessonByCourseAndDate.lesson.duringActivities!
                  }
                  lesson={data?.findLessonByCourseAndDate.lesson!}
                />
              </>
            ) : (
              <CenteredDiv>
                <div>No Lesson Scheduled for Today</div>
              </CenteredDiv>
            )}
          </>
        )}
      {state.matches('controlPanelActions.mainScreenManager')! &&
        state.context.courseInfo._id &&
        !state.context.courseSelectVisible && (
          <>
            {/* {data?.findLessonByCourseAndDate.lesson ? ( */}
            <MainScreenManagerContainer>
              <MainScreenManager />
            </MainScreenManagerContainer>
            {/* ) : (
              <CenteredDiv>
                <div>No Lesson Scheduled for Today</div>
              </CenteredDiv>
            )} */}
          </>
        )}

      {state.context.courseSelectVisible && (
        <PeriodSelectDisplayContainer>
          <PeriodSelectorDisplay />
        </PeriodSelectDisplayContainer>
      )}
    </>
  )
}
