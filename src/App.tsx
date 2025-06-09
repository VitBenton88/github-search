import '@/App.css'
import { Route, Routes } from 'react-router-dom'
import { NotificationProvider } from '@/context/notification'
import { SearchProvider } from '@/context/search'
import { NotFound, Repository, Search } from '@/pages'

function App() {
  return (
    <NotificationProvider>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/repo/:owner/:name" element={<Repository />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SearchProvider>
    </NotificationProvider>
  )
}

export default App