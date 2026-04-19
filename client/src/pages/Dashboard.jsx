import { useState, useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import SearchAddBar from '../components/SearchAddBar'
import CookieCard from '../components/cards/CookieCard'
import AddCookieModal from '../components/modals/AddCookieModal'
import UpdateCookieModal from '../components/modals/UpdateCookieModal'
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal'
import SkeletonCard from '../components/ui/SkeletonCard'
import { useCookies } from '../hooks/useCookies'

const Dashboard = () => {
    const { cookies, fetchLoading, mutating, addCookie, updateCookie, deleteCookie } = useCookies()

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedCookie, setSelectedCookie] = useState(null)
    const [searchValue, setSearchValue] = useState('')

    const filteredCookies = useMemo(() => {
        if (!searchValue) return cookies
        const q = searchValue.toLowerCase()
        return cookies.filter(c =>
            (c.websiteName || c.name || '').toLowerCase().includes(q) ||
            (c.domain || '').toLowerCase().includes(q)
        )
    }, [cookies, searchValue])

    const handleAdd = async (data) => {
        await addCookie({ name: data.name, domain: data.domain, value: data.value })
        setIsAddModalOpen(false)
    }

    const handleUpdate = async (data) => {
        await updateCookie(selectedCookie.id, { name: data.name, domain: data.domain, value: data.value })
        setIsUpdateModalOpen(false)
        setSelectedCookie(null)
    }

    const handleDelete = async () => {
        await deleteCookie(selectedCookie.id)
        setIsDeleteModalOpen(false)
        setSelectedCookie(null)
    }

    const openUpdate = (cookie) => { setSelectedCookie(cookie); setIsUpdateModalOpen(true) }
    const openDelete = (cookie) => { setSelectedCookie(cookie); setIsDeleteModalOpen(true) }

    return (
        <>
            <Navbar />
            <div className="min-h-screen pt-16">
                <SearchAddBar
                    onAddClick={() => setIsAddModalOpen(true)}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                />
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {fetchLoading ? (
                            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : filteredCookies.length > 0 ? (
                            filteredCookies.map(cookie => (
                                <CookieCard
                                    key={cookie.id}
                                    cookie={cookie}
                                    onUpdate={() => openUpdate(cookie)}
                                    onDelete={() => openDelete(cookie)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full rounded-3xl border border-dashed border-black/20 bg-white/65 py-16 text-center dark:border-white/20 dark:bg-zinc-950/60">
                                <p className="text-lg font-semibold text-black dark:text-white">No cookies found</p>
                                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Start by adding your first cookie.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Toaster position="top-right" />

            <AddCookieModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAdd} loading={mutating} />
            <UpdateCookieModal isOpen={isUpdateModalOpen} onClose={() => { setIsUpdateModalOpen(false); setSelectedCookie(null) }} onSubmit={handleUpdate} loading={mutating} cookieData={selectedCookie} />
            <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedCookie(null) }} onConfirm={handleDelete} loading={mutating} cookieName={selectedCookie?.websiteName || selectedCookie?.name || ''} />
        </>
    )
}

export default Dashboard
