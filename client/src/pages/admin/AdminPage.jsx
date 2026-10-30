import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Building2, Check, ClipboardCheck, LayoutDashboard, LoaderCircle, LogOut, Settings, Users, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getApiError } from '../../api/client.js'
import { Brand } from '../../components/Brand.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

async function fetchAdminDashboard() {
  const response = await api.get('/admin/dashboard')
  return response.data.data
}

export function AdminPage() {
  const [rejectingId, setRejectingId] = useState(null)
  const [rejectionNote, setRejectionNote] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const dashboard = useQuery({ queryKey: ['admin', 'dashboard'], queryFn: fetchAdminDashboard })
  const statusMutation = useMutation({
    mutationFn: async ({ vendorId, status, note }) => {
      const response = await api.patch(`/admin/vendors/${vendorId}/status`, {
        status,
        ...(note ? { rejectionNote: note } : {}),
      })
      return response.data
    },
    onSuccess: () => {
      setRejectingId(null)
      setRejectionNote('')
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] })
    },
  })

  const signOut = async () => { await logout(); navigate('/login', { replace: true }) }
  const updateVendor = (vendorId, status) => statusMutation.mutate({ vendorId, status })
  const rejectVendor = (vendorId) => {
    const note = rejectionNote.trim()
    if (!note) return
    statusMutation.mutate({ vendorId, status: 'REJECTED', note })
  }
  const stats = dashboard.data?.stats
  const vendors = dashboard.data?.recentVendors || []

  return (
    <div className="dashboard-page admin-page">
      <aside className="dashboard-sidebar dashboard-sidebar--dark">
        <Brand light />
        <nav><a className="active" href="#overview"><LayoutDashboard size={19} /> Overview</a><a href="#vendors"><Building2 size={19} /> Vendors</a><a href="#listings"><ClipboardCheck size={19} /> Listings</a><a href="#users"><Users size={19} /> Users</a><a href="#settings"><Settings size={19} /> Settings</a></nav>
        <button type="button" onClick={signOut}><LogOut size={18} /> Sign out</button>
      </aside>
      <main className="dashboard-main" id="overview">
        <header><div><p className="eyebrow">Voyara administration</p><h1>Good to see you, {user.firstName}</h1><p>Review marketplace activity and manage approvals.</p></div></header>

        {dashboard.isLoading && <div className="admin-loading"><LoaderCircle className="spin-icon" size={24} /> Loading marketplace data…</div>}
        {dashboard.isError && <div className="form-alert admin-alert">{getApiError(dashboard.error)} <button type="button" onClick={() => dashboard.refetch()}>Try again</button></div>}

        {!dashboard.isLoading && !dashboard.isError && <>
          <section className="admin-metrics" aria-label="Marketplace summary">
            <article><p>Pending vendors</p><strong>{stats.pendingVendors}</strong><small>Awaiting account review</small></article>
            <article><p>Listings to review</p><strong>{stats.pendingListings}</strong><small>Awaiting publication</small></article>
            <article><p>Open enquiries</p><strong>{stats.openEnquiries}</strong><small>New or in progress</small></article>
            <article><p>Total users</p><strong>{stats.totalUsers}</strong><small>Across all account types</small></article>
          </section>

          <section className="vendor-review" id="vendors">
            <div className="vendor-review__heading"><div><p className="eyebrow">Vendor applications</p><h2>Vendors awaiting review</h2></div><span>{vendors.length} shown</span></div>
            {statusMutation.isError && <div className="form-alert">{getApiError(statusMutation.error)}</div>}
            {vendors.length === 0 ? (
              <div className="admin-empty"><Check size={28} /><h2>You’re all caught up</h2><p>There are no pending vendor applications.</p></div>
            ) : (
              <div className="vendor-list">
                {vendors.map((vendor) => {
                  const isUpdating = statusMutation.isPending && statusMutation.variables?.vendorId === vendor.id
                  const isRejecting = rejectingId === vendor.id
                  return (
                    <article className="vendor-row" key={vendor.id}>
                      <div className="vendor-row__identity"><span>{vendor.agencyName.slice(0, 1).toUpperCase()}</span><div><h3>{vendor.agencyName}</h3><p>{vendor.user.firstName} {vendor.user.lastName} · {vendor.user.email}</p></div></div>
                      <div className="vendor-row__date"><small>Applied</small><span>{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(vendor.createdAt))}</span></div>
                      {!isRejecting ? (
                        <div className="vendor-row__actions"><button className="approve-button" disabled={isUpdating} type="button" onClick={() => updateVendor(vendor.id, 'APPROVED')}>{isUpdating ? <LoaderCircle className="spin-icon" size={17} /> : <Check size={17} />} Approve</button><button className="reject-button" disabled={isUpdating} type="button" onClick={() => { setRejectingId(vendor.id); setRejectionNote('') }}><X size={17} /> Reject</button></div>
                      ) : (
                        <div className="vendor-row__reject"><input value={rejectionNote} onChange={(event) => setRejectionNote(event.target.value)} placeholder="Reason for rejection" autoFocus /><button disabled={!rejectionNote.trim() || isUpdating} type="button" onClick={() => rejectVendor(vendor.id)}>{isUpdating ? 'Saving…' : 'Confirm'}</button><button type="button" aria-label="Cancel rejection" onClick={() => setRejectingId(null)}><X size={17} /></button></div>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        </>}
      </main>
    </div>
  )
}
