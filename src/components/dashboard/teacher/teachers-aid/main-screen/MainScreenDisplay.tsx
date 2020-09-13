import React, { FC } from 'react'
import { SeatingChart } from './seating-chart/SeatingChart'
import { useTeachersAidContextProvider } from '../state/TeachersAidContext'
import { VirtualProtocolResponse } from './protocol-response/VirtualProtocolResponse'
import { useSchoolDayContextProvider } from '../../../school-day/state/SchoolDayContext'
import { Attendance } from './attendance/Attendance'
import { StudentQuestionViewer } from './student-questions/StudentQuestionViewer'

export type MainScreenDisplayProps = {}

export const MainScreenDisplay: FC<MainScreenDisplayProps> = () => {
  const [state] = useTeachersAidContextProvider()

  return (
    <>
      {state.context.mainScreenSeatingChart && <SeatingChart />}
      {state.context.mainScreenVirtualAttendance && <Attendance />}
      {state.context.mainScreenVirtualProtocolResponses && (
        <>{<VirtualProtocolResponse />}</>
      )}
      {state.context.mainScreenVirtualQuestionViewer && (
        <StudentQuestionViewer />
      )}
    </>
  )
}
