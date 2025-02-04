import { createLazyFileRoute } from '@tanstack/react-router'
import Report from '@/pages/hazards/report'

export const Route = createLazyFileRoute('/hazards/report/')({
  component: () => (
    <div>
      <Report />
    </div>
  ),
})
