import React from 'react'
import {
  findLessonByCourseAndDate_findLessonByCourseAndDate_lesson,
  me_me_Teacher_teachesCourses,
} from '../../../schemaTypes'
import { WarmUp } from '../lesson-components/WarmUp'
import { LessonDetails } from '../lesson-components/LessonDetails'
import { Vocab } from '../lesson-components/Vocab'
import { Protocols } from '../lesson-components/Protocols'
import { Standard8x12Container } from '../../../appStyles'
import { useDailyAgendaContextProvider } from '../state/DailyAgendaContext'
import {
  ClassInfoContainer,
  LessonMainScreen,
  StopLessonButton,
  ClassInfoStyle,
  LessonComponentTypeContainer,
  LessonComponentTypeStyle,
  StopLessonContainer,
  LessonPageContainer,
  ProtocolsContainer,
} from '../lessonStyles'
import { date } from '../../../utils'
import { ExitActivity } from '../lesson-components/ExitActivity'

export type DynamicLessonProps = {
  lesson: findLessonByCourseAndDate_findLessonByCourseAndDate_lesson
  courseToLoad?: me_me_Teacher_teachesCourses
  stopPolling: () => void
}

export const DynamicLesson = ({
  lesson,
  courseToLoad,
  stopPolling,
}: DynamicLessonProps) => {
  const [, event] = useDailyAgendaContextProvider()
  const { dynamicLesson } = lesson
  return (
    <LessonPageContainer>
      <ClassInfoContainer>
        <ClassInfoStyle>
          <div>{courseToLoad?.name}</div>
          <div>{date}</div>
        </ClassInfoStyle>
      </ClassInfoContainer>
      <StopLessonContainer>
        <StopLessonButton
          onClick={() => {
            stopPolling()
            event({ type: 'POLLING' })
            event({ type: 'GET_LESSON' })
          }}
        >
          Leave Lesson
        </StopLessonButton>
      </StopLessonContainer>

      {lesson.duringActivities.some((protocol) => protocol.isActive) ? (
        <ProtocolsContainer>
          <Protocols lesson={lesson} />
        </ProtocolsContainer>
      ) : (
        <LessonMainScreen>
          {dynamicLesson === 'WARM_UP' && <WarmUp lesson={lesson} />}
          {dynamicLesson === 'LESSON_DETAILS' && (
            <LessonDetails lesson={lesson} />
          )}
          {dynamicLesson === 'VOCAB' && <Vocab lesson={lesson} />}
          {dynamicLesson === 'EXIT_ACTIVITY' && (
            <ExitActivity lesson={lesson} />
          )}
        </LessonMainScreen>
      )}

      <LessonComponentTypeContainer>
        <LessonComponentTypeStyle>Live Class</LessonComponentTypeStyle>
      </LessonComponentTypeContainer>
    </LessonPageContainer>
  )
}
