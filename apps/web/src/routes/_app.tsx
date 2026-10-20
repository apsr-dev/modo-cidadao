import { createFileRoute, getRouteApi, Outlet } from '@tanstack/react-router'
import { Shell } from '../features/shell'

export const Route = createFileRoute('/_app')({ component: WorkspaceLayout })
function WorkspaceLayout() {
  const { demo } = getRouteApi('__root__').useLoaderData()
  return (
    <Shell demo={demo}>
      <Outlet />
    </Shell>
  )
}
