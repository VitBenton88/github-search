import { Route, Routes } from 'react-router-dom'
import { useFocusMainOnRouteChange } from '@/hooks/useFocusMainOnRouteChange'
import { NotFound, Repository, Search } from '@/pages'

const AppRouter = () => {
  useFocusMainOnRouteChange()

  return (
    <Routes>
      <Route path="/" element={<Search />} />
      <Route path="/repo/:owner/:name" element={<Repository />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter