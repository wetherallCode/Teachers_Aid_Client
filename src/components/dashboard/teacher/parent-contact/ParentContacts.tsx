import React, { FC } from 'react'
import { Route, Routes } from 'react-router'
import { AllContacts } from './all-contacts/AllContacts'
import { CreateContact } from './create-contacts/CreateContact'
import { CreateContactContextProvider } from './create-contacts/state-style/CreateContactContext'

export type ParentContactsProps = {}

export const ParentContacts: FC<ParentContactsProps> = () => {
  return (
    <>
      <Routes>
        <Route path='contacts' element={<AllContacts />} />
      </Routes>
      <Routes>
        <Route
          path='create-contact'
          element={
            <CreateContactContextProvider>
              <CreateContact />
            </CreateContactContextProvider>
          }
        />
      </Routes>
    </>
  )
}
