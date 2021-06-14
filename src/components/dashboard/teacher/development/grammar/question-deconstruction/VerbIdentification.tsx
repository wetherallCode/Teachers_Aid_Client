import React, { Dispatch, SetStateAction, useEffect } from 'react'
import styled from 'styled-components'
import { useSelectedText } from '../../../../../../hooks/useSelectedText'
import { simplePredicateGrader } from '../simple-subject-predicate/simplePredicateGrader'
import { QuestionProps, QuestionDeconstructProps } from './QuestionDeconstruction'

export type VerbIdentificationProps = {
	setState: Dispatch<SetStateAction<QuestionDeconstructProps>>
	questionToModify: string[]
	question: QuestionProps
	verb: string | null
	setVerb: Dispatch<SetStateAction<string | null>>
}

export const VerbIdentification = ({
	questionToModify,
	setState,
	question,
	verb,
	setVerb,
}: VerbIdentificationProps) => {
	const [select, text, reset] = useSelectedText()
	const isAnswered = text === ''
	const neededHelpingVerb = question.helpingVerb !== 'did'

	const { correctSimplePredicate, howToFix, message, whatWentWrong } = simplePredicateGrader({
		completePredicate: neededHelpingVerb
			? question.helpingVerb + ' ' + question.completePredicate
			: question.completePredicate,
		correctSimplePredicate: neededHelpingVerb
			? question.helpingVerb + ' ' + question.simplePredicate
			: question.simplePredicate,
		givenSimplePredicate: text.trim(),
		verbType: question.verbType,
	})

	useEffect(() => {
		if (correctSimplePredicate) {
			setVerb(text)
			setTimeout(() => {
				setState('object-identification')
			}, 3000)
		}
	}, [correctSimplePredicate])

	return (
		<>
			<div>Find the Verb or Verb Phrase</div>

			<LineToManipulate onMouseUp={select}>
				{questionToModify
					.join(' ')
					.split(' ')
					.map((part, i: number) => (
						<span key={i}>
							<span>{part}</span>
							{part !== questionToModify[questionToModify.length - 1] && <span> </span>}
						</span>
					))}
			</LineToManipulate>
			<div>
				{isAnswered ? (
					''
				) : (
					<div>
						<div>{correctSimplePredicate ? 'Correct' : 'Not Quite'}</div>
						{!correctSimplePredicate ? (
							<>
								<div>
									What went wrong? <span>{whatWentWrong}</span>
								</div>
								<div>
									How do you fix it? <span>{howToFix}</span>
								</div>
							</>
						) : (
							<div>{message}</div>
						)}
					</div>
				)}
			</div>
		</>
	)
}

export const LineToManipulate = styled.div`
	& ::selection {
		background-color: var(--blue);
		color: var(--white);
	}
	cursor: pointer;
`
