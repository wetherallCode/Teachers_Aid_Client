import React, { FC, useEffect } from 'react'
import { useRubricEditorContextProvider } from '../RubricEditorContext'
import { useCheckBox } from '../../../../../../hooks/useCheckBox'
import { WritingLevelEnum } from '../../../../../../schemaTypes'
import { useEnumContextProvider } from '../../../../../../contexts/EnumContext'

export type EditWritingLevelProps = {}

export const EditWritingLevel: FC<EditWritingLevelProps> = () => {
  const [state, event] = useRubricEditorContextProvider()
  const [writingLevelList, handleCheckbox] = useCheckBox()
  const { writingLevelEnum } = useEnumContextProvider()

  useEffect(() => {
    event({
      type: 'SET_EDITABLE_ENTRY',
      payload: {
        ...state.context.editableRubricEntry,
        rubricWritingLevels: writingLevelList as WritingLevelEnum[],
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writingLevelList])

  return (
    <>
      <div>Writing Levels</div>
      {writingLevelEnum.map((level: WritingLevelEnum) => (
        <div key={level}>
          <input
            type='checkbox'
            value={level}
            checked={state.context.editableRubricEntry.rubricWritingLevels.includes(
              level
            )}
            onChange={handleCheckbox}
          />
          <div>{level}</div>
        </div>
      ))}
    </>
  )
}
