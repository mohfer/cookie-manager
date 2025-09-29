import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import Navbar from '../components/Navbar'
import SearchAddBar from '../components/SearchAddBar'
import CookieCard from '../components/cards/CookieCard'
import AddCookieModal from '../components/modals/AddCookieModal'
import UpdateCookieModal from '../components/modals/UpdateCookieModal'
import DeleteConfirmModal from '../components/modals/DeleteConfirmModal'
import SkeletonCard from '../components/ui/SkeletonCard'
import { getCookiesApi, createCookieApi, updateCookieApi, deleteCookieApi } from '../api/cookies'

const Dashboard = () => {
    const [isAddCookieModalOpen, setIsAddCookieModalOpen] = useState(false)
    const [isUpdateCookieModalOpen, setIsUpdateCookieModalOpen] = useState(false)
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false)
    const [selectedCookie, setSelectedCookie] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(true)
    const [cookies, setCookies] = useState([])

    useEffect(() => {
        fetchCookies()
    }, [])

    const fetchCookies = async () => {
        setFetchLoading(true)
        try {
            const cookiesData = await getCookiesApi()

            console.log('Fetched cookies data:', cookiesData)

            setCookies(cookiesData)
        } catch (error) {
            console.error('Fetch cookies error:', error)
            toast.error(error.message || 'Failed to fetch cookies')
        } finally {
            setFetchLoading(false)
        }
    }

    const handleAddClick = () => {
        setIsAddCookieModalOpen(true)
    }

    const handleCloseAddCookieModal = () => {
        setIsAddCookieModalOpen(false)
    }

    const handleUpdateClick = (cookie) => {
        setSelectedCookie(cookie)
        setIsUpdateCookieModalOpen(true)
    }

    const handleCloseUpdateCookieModal = () => {
        setIsUpdateCookieModalOpen(false)
        setSelectedCookie(null)
    }

    const handleDeleteClick = (cookie) => {
        setSelectedCookie(cookie)
        setIsDeleteConfirmModalOpen(true)
    }

    const handleCloseDeleteConfirmModal = () => {
        setIsDeleteConfirmModalOpen(false)
        setSelectedCookie(null)
    }

    const handleAddCookie = async (cookieData) => {
        setLoading(true)
        try {
            const newCookie = await createCookieApi({
                name: cookieData.name,
                domain: cookieData.domain,
                value: cookieData.value
            })
            setCookies(prev => [...prev, newCookie])
            setIsAddCookieModalOpen(false)
            toast.success('Cookie added successfully!')
        } catch (error) {
            toast.error(error.message || 'Failed to add cookie')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateCookie = async (cookieData) => {
        setLoading(true)
        try {
            const updatedCookie = await updateCookieApi(selectedCookie.id, {
                name: cookieData.name,
                domain: cookieData.domain,
                value: cookieData.value
            })
            setCookies(prev => prev.map(cookie =>
                cookie.id === selectedCookie.id ? updatedCookie : cookie
            ))
            setIsUpdateCookieModalOpen(false)
            toast.success('Cookie updated successfully!')
        } catch (error) {
            toast.error(error.message || 'Failed to update cookie')
            throw error
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCookie = async () => {
        setLoading(true)
        try {
            await deleteCookieApi(selectedCookie.id)
            setCookies(prev => prev.filter(cookie => cookie.id !== selectedCookie.id))
            setIsDeleteConfirmModalOpen(false)
            toast.success('Cookie deleted successfully!')
        } catch (error) {
            toast.error(error.message || 'Failed to delete cookie')
        } finally {
            setLoading(false)
        }
    }

    const filteredCookies = cookies.filter(cookie => {
        const websiteName = cookie.websiteName || cookie.name || ''
        const domain = cookie.domain || ''

        return websiteName.toLowerCase().includes(searchValue.toLowerCase()) ||
            domain.toLowerCase().includes(searchValue.toLowerCase())
    })

    return (
        <>
            <Navbar />
            <div className='pt-16 min-h-screen bg-gray-50 dark:bg-zinc-900'>
                <SearchAddBar
                    onAddClick={handleAddClick}
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                />
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                        {fetchLoading ? (
                            Array.from({ length: 8 }).map((_, index) => (
                                <SkeletonCard key={index} />
                            ))
                        ) : filteredCookies.length > 0 ? (
                            filteredCookies.map(cookie => (
                                <CookieCard
                                    key={cookie.id}
                                    cookie={cookie}
                                    onUpdate={() => handleUpdateClick(cookie)}
                                    onDelete={() => handleDeleteClick(cookie)}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <div className="text-gray-500 dark:text-gray-400">
                                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <p className="text-lg font-medium">No cookies found</p>
                                    <p className="text-sm">Start by adding your first cookie</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Toaster position="top-right" />

            <AddCookieModal
                isOpen={isAddCookieModalOpen}
                onClose={handleCloseAddCookieModal}
                onSubmit={handleAddCookie}
                loading={loading}
            />

            <UpdateCookieModal
                isOpen={isUpdateCookieModalOpen}
                onClose={handleCloseUpdateCookieModal}
                onSubmit={handleUpdateCookie}
                loading={loading}
                cookieData={selectedCookie}
            />

            <DeleteConfirmModal
                isOpen={isDeleteConfirmModalOpen}
                onClose={handleCloseDeleteConfirmModal}
                onConfirm={handleDeleteCookie}
                loading={loading}
                cookieName={selectedCookie?.websiteName || selectedCookie?.name || ''}
            />
        </>
    )
}

export default Dashboard