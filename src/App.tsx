import '@/App.css'
import { Route, Routes } from 'react-router-dom'
import { NotificationProvider } from '@/context/notification/NotificationProvider'
import { SearchProvider } from '@/context/search/SearchProvider'
import NotFoundRedirect from '@/pages/NotFound'
import Repository from '@/pages/Repository'
import Search from '@/pages/Search'

function App() {
  return (
    <NotificationProvider>
      <SearchProvider>
        <Routes>
          <Route path="/" element={<Search />} />
          <Route path="/repo/:owner/:name" element={<Repository />} />
          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </SearchProvider>
    </NotificationProvider>
  )
}

export default App