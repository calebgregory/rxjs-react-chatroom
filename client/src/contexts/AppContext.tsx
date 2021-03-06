import React from 'react'
import { app } from 'src/app'

export const AppContext = React.createContext(app)

export function AppProvider(props: any) {
  return <AppContext.Provider value={app}>
    {props.children}
  </AppContext.Provider>
}