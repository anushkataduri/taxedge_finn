import { EmptyState, Loader } from '@shared/components'
import { useAuthStore } from '@store/index'

import {
  DashboardHero,
  DashboardStats,
  DeadlineBanner,
  PendingOnYou,
  QuickServices,
  RecentApplications,
  UpcomingDeadlines,
} from '../../components'
import { useDashboardSummary } from '../../hooks/useDashboardSummary'
import { quickServices } from '../../services/dashboardService'
import './CustomerDashboard.css'

export const CustomerDashboard = () => {
  const user = useAuthStore((state) => state.user)
  const { data, isLoading, error } = useDashboardSummary()

  if (isLoading) return <Loader fullPage label="Loading your dashboard" />
  if (error || !data) {
    return <EmptyState title="We could not load your dashboard" description={error ?? undefined} />
  }

  return (
    <div className="dashboard">
      <DashboardHero userName={user?.fullName ?? 'there'} brief={data.brief} />

      {data.deadline && <DeadlineBanner deadline={data.deadline} />}

      <DashboardStats stats={data.stats} />

      <QuickServices services={quickServices} />

      <RecentApplications applications={data.recentApplications} />

      <div className="dashboard__columns">
        <PendingOnYou tasks={data.pendingTasks} />
        <UpcomingDeadlines deadlines={data.upcomingDeadlinesList} />
      </div>
    </div>
  )
}

export default CustomerDashboard
