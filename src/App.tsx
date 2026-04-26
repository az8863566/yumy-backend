import { App as AntApp } from 'antd'
import { RouterProvider } from 'react-router'
import { router } from './router'

function App() {
  return (
    <AntApp>
      <RouterProvider router={router} />
    </AntApp>
  )
}

export default App
