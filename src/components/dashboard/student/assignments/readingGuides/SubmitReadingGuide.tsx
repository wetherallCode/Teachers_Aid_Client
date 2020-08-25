import React, { FC } from 'react'
import { gql, useMutation } from '@apollo/client'
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  submitReadingGuide,
  submitReadingGuideVariables,
} from '../../../../../schemaTypes'
import { useNavigate } from 'react-router'
import { useReadingGuideToCompleteContextProvider } from './state/ReadingGuideToCompleteContext'

export type SubmitReadingGuideProps = {}

export const SUBMIT_READING_GUIDE_MUTATION = gql`
  mutation submitReadingGuide($input: SubmitReadingGuideInput!) {
    submitReadingGuide(input: $input) {
      readingGuide {
        _id
      }
    }
  }
`

export const SubmitReadingGuide: FC<SubmitReadingGuideProps> = () => {
  const navigate = useNavigate()
  const [state] = useReadingGuideToCompleteContextProvider()

  const [submitReadingGuide] = useMutation<
    submitReadingGuide,
    submitReadingGuideVariables
  >(SUBMIT_READING_GUIDE_MUTATION, {
    variables: { input: state.context.submitReadingGuideInputs },
    onCompleted: () => navigate('/dashboard/assignments'),
    refetchQueries: ['findReadingGuidesToComplete', 'findReadingGuideById'],
  })

  return (
    <>
      <button onClick={() => submitReadingGuide()}>Submit</button>
    </>
  )
}