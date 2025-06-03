import '@/App.css'
import { Route, Routes } from 'react-router-dom'
import { SearchProvider } from '@/context/SearchContext'
import NotFoundRedirect from '@/pages/NotFound'
import Repository from '@/pages/Repository'
import Search from '@/pages/Search'

function App() {
  return (
    <SearchProvider>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/repo/:owner/:name" element={<Repository />} />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    </SearchProvider>
  )
}

export default App