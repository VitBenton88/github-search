import '@/App.css'
import { NotificationProvider } from '@/context/notification'
import { SearchProvider } from '@/context/search'
import AppRouter from '@/router'

function App() {
  return (
    <NotificationProvider>
      <SearchProvider>
        <AppRouter />
      </SearchProvider>
    </NotificationProvider>
  )
}

export default App