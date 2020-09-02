import React, { FC } from 'react'
import {
  EssayInfoTitle,
  EssayInfoBody,
  EssaySectionOrganizationBodyEntry,
} from '../state-and-styles/essayInfoStyles'
import { useStudentEssayContextProvider } from '../state-and-styles/StudentEssayContext'

export type RubricsProps = {}

export const Rubrics: FC<RubricsProps> = () => {
  const [state] = useStudentEssayContextProvider()
  return (
    <>
      <EssayInfoTitle>Rubric</EssayInfoTitle>
      <EssayInfoBody>
        {state.matches('workingDraft') && (
          <ul>
            {state.context.writingLevel === 'DEVELOPING' && (
              <EssaySectionOrganizationBodyEntry>
                Developing Rubric
              </EssaySectionOrganizationBodyEntry>
            )}
            {state.context.writingLevel === 'ACADEMIC' && (
              <EssaySectionOrganizationBodyEntry>
                Academic Rubric
              </EssaySectionOrganizationBodyEntry>
            )}
            {state.context.writingLevel === 'ADVANCED' && (
              <EssaySectionOrganizationBodyEntry>
                Advanced Rubric
              </EssaySectionOrganizationBodyEntry>
            )}
          </ul>
        )}
      </EssayInfoBody>
    </>
  )
}
