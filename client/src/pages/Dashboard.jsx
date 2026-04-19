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
            <div className="pt-16 min-h-screen bg-gray-50 dark:bg-zinc-900">
                <SearchAddBar
                    onAddClick={() => setIsAddModalOpen(true)}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                            <div className="col-span-full text-center py-12">
                                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No cookies found</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">Start by adding your first cookie</p>
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
