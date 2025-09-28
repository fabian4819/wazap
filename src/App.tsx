import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { History } from '@/pages/History'
import { DataStreaming } from '@/pages/DataStreaming'
import { Information } from '@/pages/Information'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="history" element={<History />} />
          <Route path="streaming" element={<DataStreaming />} />
          <Route path="info" element={<Information />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
