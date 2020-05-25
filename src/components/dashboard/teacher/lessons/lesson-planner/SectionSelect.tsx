import React, { FC, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import {
  findTextSectionsByChapter,
  findTextSectionsByChapterVariables,
} from '../../../../../schemaTypes'
import { FIND_TEXT_SECTIONS_BY_CHAPTER_QUERY } from '../section-editor/TextSectionList'
import { useLessonPlannerContextProvider } from './lessonPlannerContext'

export type SectionSelectProps = {}

export const SectionSelect: FC<SectionSelectProps> = () => {
  const [state, event] = useLessonPlannerContextProvider()

  useEffect(() => {
    if (state.context.textSectionList.length > 0) {
      event({
        type: 'SET_STARTING_SECTION',
        payload: state.context.texSectionListHeaders[0],
      })
      event({
        type: 'SET_ENDING_SECTION',
        payload:
          state.context.texSectionListHeaders[
            state.context.texSectionListHeaders.length - 1
          ],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.context.texSectionListHeaders])

  const { loading, error, data } = useQuery<
    findTextSectionsByChapter,
    findTextSectionsByChapterVariables
  >(FIND_TEXT_SECTIONS_BY_CHAPTER_QUERY, {
    variables: {
      input: { fromChapterId: state.context.fromChapterId },
    },
  })
  if (loading) return <div>Loading </div>
  if (error) console.error(error)
  console.log(state.context.currentSection.includes('none'))
  return (
    <div>
      <form onSubmit={(e: any) => e.preventDefault()}>
        <select
          onChange={(e: any) => {
            console.log(e.target.value)
            if (e.target.value !== 'Select a Section') {
              const arr = e.target.value.split(',')
              event({ type: 'SET_CURRENT_SECTION', payload: [arr[0], arr[1]] })
            } else event({ type: 'SET_CURRENT_SECTION', payload: ['none'] })
          }}
        >
          <option value={undefined}>Select a Section</option>
          {data?.findTextSectionsByChapter.textSections.map((sections) => (
            <option
              key={sections._id!}
              value={[sections._id!, sections.header]}
            >
              {sections.header}
            </option>
          ))}
        </select>
        <button
          type='reset'
          onClick={() => {
            if (
              state.context.currentSection.length > 0 &&
              !state.context.currentSection.includes('none')
            ) {
              event({
                type: 'ADD_SECTIONS',
                payload: [
                  state.context.currentSection[0],
                  state.context.currentSection[1],
                ],
              })
              event({ type: 'SET_CURRENT_SECTION', payload: ['none'] })
            }
          }}
        >
          Add Section
        </button>
        <button onClick={() => event({ type: 'NEXT' })}>Next</button>
      </form>
    </div>
  )
}