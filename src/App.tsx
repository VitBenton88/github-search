import './App.css'
import { Routes, Route } from 'react-router-dom'
import { SearchProvider } from './context/SearchContext'
import Search from '@/components/Search'
import Repository from '@/components/Repository'

function App() {
  return (
    <SearchProvider>
      <Routes>
        <Route path='/' element={<Search />} />
        <Route path='/repo/:owner/:name' element={<Repository />} />
      </Routes>
    </SearchProvider>
  )
}

export default App
