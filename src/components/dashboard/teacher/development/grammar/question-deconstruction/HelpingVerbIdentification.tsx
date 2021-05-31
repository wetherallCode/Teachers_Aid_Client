import React, { Dispatch, SetStateAction, useState } from 'react'
import { useSelectedText } from '../../../../../../hooks/useSelectedText'
import { capitalizer } from '../../../../../../utils'
import { QuestionProps } from './QuestionDeconstruction'

export type HelpingVerbIdentificationProps = {
  questionToModify: string[]
  question: QuestionProps
  setQuestionToModify: Dispatch<SetStateAction<string[]>>
  setState: React.Dispatch<
    React.SetStateAction<
      | 'question-word-removal'
      | 'helping-verb-id'
      | 'subject-predicate-split'
      | 'subject-identification'
      | 'verb-identification'
      | 'object-identification'
    >
  >
}

export const HelpingVerbIdentification = ({
  questionToModify,
  setQuestionToModify,
  setState,
  question,
}: HelpingVerbIdentificationProps) => {
  const [select, text, reset] = useSelectedText()
  const [point, setPoint] = useState<number | null>(null)

  const removeDidHandler = (word: string) => {
    const index = questionToModify.findIndex(
      (wordToFind) => wordToFind === word
    )
    setQuestionToModify([
      ...questionToModify.slice(0, index),
      ...questionToModify.slice(index + 1),
    ])
  }

  const moveBeingWord = (word: string) => {
    if (word === 'was' || word === 'were') {
      const index = questionToModify.findIndex(
        (wordToFind) => wordToFind === word
      )

      setQuestionToModify([
        ...questionToModify.slice(0, index),
        ...questionToModify.slice(index + 1),
      ])
    }
  }

  const addBeingWord = (letter: string) => {}

  const helpingVerbCheck = (word: string) => {
    if (word === question.helpingVerb && question.helpingVerb === 'did') {
      removeDidHandler(word)
    } else if (word === question.helpingVerb) {
      moveBeingWord(word)
    } else console.log('incorrect')
  }

  return (
    <>
      <div>
        {question.helpingVerb === 'did' && (
          <>
            <div>
              Since the helping verb is "Did," you don't need it in the sentence
              anymore. Double click to remove the word.
            </div>
            <div onMouseUp={select}>
              {questionToModify.map((word, i: number) => (
                <span key={i}>
                  <span
                    onDoubleClick={() => removeDidHandler(word.toLowerCase())}
                  >
                    {word === questionToModify[0] ? capitalizer(word) : word}
                  </span>
                  {word !== questionToModify[questionToModify.length - 2] && (
                    <span> </span>
                  )}
                </span>
              ))}
            </div>
          </>
        )}
        {question.helpingVerb !== 'did' && (
          <div onMouseUp={select}>
            {questionToModify.includes('was' || 'were')
              ? questionToModify.map((word, i: number) => (
                  <span key={i}>
                    <span
                      onDoubleClick={() => helpingVerbCheck(word.toLowerCase())}
                    >
                      {word === questionToModify[0] ? capitalizer(word) : word}
                    </span>
                    {word !== questionToModify[questionToModify.length - 2] && (
                      <span> </span>
                    )}
                  </span>
                ))
              : [
                  ...questionToModify.slice(0, questionToModify.length - 2),
                  questionToModify[questionToModify.length - 2] + '?',
                ]
                  .join(' ')
                  .split('')
                  .map((letter, i: number) => (
                    <span
                      key={i}
                      onDoubleClick={() => {
                        // setQuestionToModify(..questionToModify.slice()])
                      }}
                    >
                      {letter}
                    </span>
                  ))}
          </div>
        )}
      </div>
    </>
  )
}
