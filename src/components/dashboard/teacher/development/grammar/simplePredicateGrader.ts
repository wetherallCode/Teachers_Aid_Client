export type SimplePredicateGraderProps = {
	correctSimplePredicate: string
	givenSimplePredicate: string
	completePredicate: string
}

export const simplePredicateGrader = ({
	correctSimplePredicate,
	givenSimplePredicate,
	completePredicate,
}: SimplePredicateGraderProps) => {
	if (!completePredicate.includes(givenSimplePredicate)) {
		return {
			whatWentWrong: 'Your simple predicate is in the subject.',
			howToFix:
				'Look at the subject only and find the person, place, idea, or thing that is in the complete subject.',
			correctSimplePredicate: false,
		}
	}
	if (givenSimplePredicate !== correctSimplePredicate) {
		return {
			whatWentWrong:
				'Your simple predicate is in the complete subject, but is not the verb in the complete predicate',
			howToFix:
				'Find the action word, being word, or feeling word that is in the complete predicate.',
			correctSimplePredicate: false,
		}
	}
	if (givenSimplePredicate === correctSimplePredicate) {
		return {
			correctSimplePredicate: true,
			message: "That's right - Great job!",
		}
	}

	return { message: `Everything is good` }
}