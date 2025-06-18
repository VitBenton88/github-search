import { Route, Routes } from 'react-router-dom'
import { NotFound, Repository, Search } from '@/pages'

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Search />} />
    <Route path="/repo/:owner/:name" element={<Repository />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
)

export default AppRouter