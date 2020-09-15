import React, { FC, useEffect } from 'react'
import { Greetings } from '../home/Greetings'
import { useUserContextProvider } from '../../contexts/UserContext'
import {
  me_me,
  findLessonByCourseAndDate,
  findLessonByCourseAndDateVariables,
  studentSignedInCheck,
  studentSignedInCheckVariables,
  studentSignInVariables,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  studentSignIn,
  SchoolDayType,
} from '../../schemaTypes'
import { capitalizer, time, timeFinder, date } from '../../utils'
import { useDailyAgendaContextProvider } from './state/DailyAgendaContext'
import { useLazyQuery, gql, useQuery, useMutation } from '@apollo/client'

import {
  LessonMainMenuContainer,
  GreetingsContainer,
  LessonSelectorContainer,
  CurrentLessonContainer,
  CurrentLesson,
  GoToLessonButton,
  LessonNameStyle,
} from './state/lessonStyles'
import { DynamicLesson } from './lessson-types/DynamicLesson'
import { StaticLesson } from './lessson-types/StaticLesson'
import { useSchoolDayContextProvider } from '../dashboard/school-day/state/SchoolDayContext'
import { useNavigate, Navigate } from 'react-router'

export type LessonMainMenuProps = {}

export const FIND_LESSON_QUERY = gql`
  query findLessonByCourseAndDate($input: FindLessonByCourseAndDateInput!) {
    findLessonByCourseAndDate(input: $input) {
      lesson {
        _id
        lessonName
        vocabList {
          word
          definition
        }
        assignedMarkingPeriod
        pageNumbers {
          startingPage
          endingPage
        }
        assignedCourses {
          _id
          hasSignInSheets {
            studentsSignInlog {
              _id
            }
          }
        }
        assignedSections {
          startingSection
          endingSection
        }
        objectives
        essentialQuestion
        duringActivities {
          task
          activityType
          academicOutcomeTypes
          isActive
          completed
        }
        beforeActivity {
          task
          activityType
          academicOutcomeTypes
          isActive
        }
        afterActivity {
          task
          activityType
          academicOutcomeTypes
          isActive
        }
        dynamicLesson
      }
    }
  }
`

export const STUDENT_SIGNED_IN_CHECK_QUERY = gql`
  query studentSignedInCheck($input: FindSchoolDayByDateInput!) {
    findSchoolDayByDate(input: $input) {
      schoolDay {
        _id
        signInSheets {
          studentsSignInlog {
            _id
          }
        }
      }
    }
  }
`
export const STUDENT_SIGN_IN_MUTATION = gql`
  mutation studentSignIn($input: StudentSignInInput!) {
    studentSignIn(input: $input) {
      schoolDay {
        _id
      }
    }
  }
`

export const LessonMainMenu: FC<LessonMainMenuProps> = () => {
  const me: me_me = useUserContextProvider()
  const [state, event] = useDailyAgendaContextProvider()
  const navigate = useNavigate()
  const [schoolDayState] = useSchoolDayContextProvider()
  const { currentSchoolDayType } = schoolDayState.context.currentSchoolDay

  const [courseToLoad] =
    me.__typename === 'Teacher'
      ? me.teachesCourses.filter(
          (course) =>
            Date.parse(time) >
              Date.parse(timeFinder(course.hasCourseInfo?.startsAt!)) &&
            Date.parse(time) <
              Date.parse(timeFinder(course.hasCourseInfo?.endsAt!)) &&
            course.hasCourseInfo?.schoolDayType === currentSchoolDayType
        )
      : me.inCourses.filter(
          (course) =>
            Date.parse(time) >
              Date.parse(timeFinder(course.hasCourseInfo?.startsAt!)) &&
            Date.parse(time) <
              Date.parse(timeFinder(course.hasCourseInfo?.endsAt!))
        )
  console.log(courseToLoad)
  const [
    loadLesson,
    { loading, data, startPolling, stopPolling },
  ] = useLazyQuery<
    findLessonByCourseAndDate,
    findLessonByCourseAndDateVariables
  >(FIND_LESSON_QUERY, {
    onCompleted: (data) => {
      console.log(data.findLessonByCourseAndDate.lesson)
    },
    onError: (error) => console.error(error),
  })

  const course = data?.findLessonByCourseAndDate.lesson?.assignedCourses.filter(
    (course) => course._id === courseToLoad?._id
  )

  const handleSignInCheck = (_id: string) => {
    const check = course?.some((stuff) => {
      if (
        stuff.hasSignInSheets.some((sheet) =>
          sheet.studentsSignInlog?.some((signIn) => signIn._id === _id)
        )
      ) {
        return true
      } else return false
    })
    return check
  }

  const [studentSignIn] = useMutation<studentSignIn, studentSignInVariables>(
    STUDENT_SIGN_IN_MUTATION,
    {
      variables: {
        input: {
          courseId: courseToLoad?._id!,
          lessonDate: date,
          studentId: me._id!,
          virtual: true,
        },
      },
      onCompleted: () => {
        event({ type: 'TODAYS_LESSON' })
        startPolling!(100)
        event({ type: 'POLLING' })
      },
      refetchQueries: ['studentSignedInCheck', 'me'],
    }
  )

  useEffect(() => {
    if (courseToLoad) {
      loadLesson({
        variables: { input: { courseId: courseToLoad._id!, lessonDate: date } },
      })
    }
  }, [courseToLoad, loadLesson])

  if (loading) return <div>Loading </div>
  if (!me) return <Navigate to='/' />
  return (
    <>
      {state.matches('getLesson') && (
        <LessonMainMenuContainer>
          <GreetingsContainer>
            <Greetings
              phrase={
                me.__typename === 'Teacher'
                  ? `${capitalizer(me.title)}. ${me.lastName}`
                  : `${me.firstName}`
              }
            />
          </GreetingsContainer>
          <LessonSelectorContainer>
            <CurrentLessonContainer>
              <>
                {data?.findLessonByCourseAndDate.lesson ? (
                  <>
                    <CurrentLesson>Current Lesson</CurrentLesson>
                    <LessonNameStyle>
                      {me.__typename === 'Teacher' && `${courseToLoad.name}`}
                      {data.findLessonByCourseAndDate.lesson?.lessonName}
                    </LessonNameStyle>
                    <GoToLessonButton
                      onClick={() => {
                        if (courseToLoad) {
                          if (
                            me.__typename === 'Student' &&
                            handleSignInCheck(me._id!)
                          ) {
                            event({ type: 'TODAYS_LESSON' })
                            startPolling!(100)
                            event({ type: 'POLLING' })
                          } else if (me.__typename === 'Teacher') {
                            event({ type: 'TODAYS_LESSON' })
                            startPolling!(100)
                            event({ type: 'POLLING' })
                          } else {
                            studentSignIn()
                          }
                        }
                      }}
                    >
                      {me.__typename === 'Student' &&
                      !handleSignInCheck(me._id!)
                        ? 'Sign In'
                        : 'Go To Lesson'}
                    </GoToLessonButton>
                  </>
                ) : (
                  <LessonNameStyle>No Lesson Scheduled</LessonNameStyle>
                )}
              </>
            </CurrentLessonContainer>
            <button>Get Old Lessons</button>
          </LessonSelectorContainer>
        </LessonMainMenuContainer>
      )}
      {state.matches('todaysLesson') && (
        <>
          {data?.findLessonByCourseAndDate.lesson!.dynamicLesson !== 'OFF' ? (
            <>
              <DynamicLesson
                lesson={data?.findLessonByCourseAndDate.lesson!}
                stopPolling={stopPolling!}
                courseToLoad={courseToLoad}
              />
            </>
          ) : (
            <StaticLesson
              lesson={data?.findLessonByCourseAndDate.lesson!}
              courseToLoad={courseToLoad}
            />
          )}
        </>
      )}
    </>
  )
}
