import '@/App.css'
import { Route, Routes } from 'react-router-dom'
import { NotificationProvider } from '@/context/notification/NotificationProvider'
import { SearchProvider } from '@/context/search/SearchProvider'
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