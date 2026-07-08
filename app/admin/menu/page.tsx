'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRequireAuth } from '@/lib/admin/auth'
import { menuItems as mockMenuItems } from '@/lib/admin/data'
import type { AdminMenuItem, MenuCategory } from '@/lib/admin/types'
import DataTable from '@/components/admin/DataTable'
import Modal from '@/components/admin/Modal'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

type ModalMode = 'add' | 'edit' | 'view' | null

interface MenuFormData {
  name: string
  description: string
  category: MenuCategory
  price: number
  discount: number
  prepTime: number
  calories: number
  available: boolean
  featured: boolean
  hidden: boolean
}

const CATEGORIES: MenuCategory[] = [
  'starters', 'main-course', 'pizza', 'pasta', 'burgers',
  'desserts', 'drinks', 'coffee', 'specials',
]

const categoriesWithAll = ['All' as const, ...CATEGORIES]
const availabilityOptions = ['All', 'Available', 'Hidden'] as const

const categoryBadge: Record<MenuCategory, string> = {
  'starters': 'bg-amber-500/15 text-amber-400',
  'main-course': 'bg-bronze/15 text-amber',
  'pizza': 'bg-yellow-500/15 text-yellow-400',
  'pasta': 'bg-orange-500/15 text-orange-400',
  'burgers': 'bg-amber-500/15 text-amber-400',
  'desserts': 'bg-pink-500/15 text-pink-400',
  'drinks': 'bg-cyan-500/15 text-cyan-400',
  'coffee': 'bg-amber-500/15 text-amber-400',
  'specials': 'bg-purple-500/15 text-purple-400',
}

const defaultFormData: MenuFormData = {
  name: '',
  description: '',
  category: 'starters',
  price: 0,
  discount: 0,
  prepTime: 0,
  calories: 0,
  available: true,
  featured: false,
  hidden: false,
}

export default function MenuPage() {
  useRequireAuth()

  const [items, setItems] = useState<AdminMenuItem[]>(() => [...mockMenuItems])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All')
  const [selectedItem, setSelectedItem] = useState<AdminMenuItem | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [formData, setFormData] = useState<MenuFormData>(defaultFormData)
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((type: Toast['type'], message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
      const matchesAvailability =
        availabilityFilter === 'All' ||
        (availabilityFilter === 'Available' && item.available) ||
        (availabilityFilter === 'Hidden' && item.hidden)
      return matchesSearch && matchesCategory && matchesAvailability
    })
  }, [items, searchTerm, categoryFilter, availabilityFilter])

  const openView = useCallback((item: AdminMenuItem) => {
    setSelectedItem(item)
    setModalMode('view')
  }, [])

  const openEdit = useCallback((item: AdminMenuItem) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      discount: item.discount,
      prepTime: item.prepTime,
      calories: item.calories,
      available: item.available,
      featured: item.featured,
      hidden: item.hidden,
    })
    setModalMode('edit')
  }, [])

  const openAdd = useCallback(() => {
    setSelectedItem(null)
    setFormData(defaultFormData)
    setModalMode('add')
  }, [])

  const closeModal = useCallback(() => {
    setSelectedItem(null)
    setModalMode(null)
  }, [])

  const handleSave = useCallback(() => {
    if (modalMode === 'add') {
      const newItem: AdminMenuItem = {
        id: `m${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setItems(prev => [newItem, ...prev])
      showToast('success', `"${formData.name}" added to menu`)
    } else if (modalMode === 'edit' && selectedItem) {
      setItems(prev =>
        prev.map(item =>
          item.id === selectedItem.id ? { ...item, ...formData } : item
        )
      )
      showToast('success', `"${formData.name}" updated`)
    }
    closeModal()
  }, [modalMode, formData, selectedItem, showToast, closeModal])

  const handleDelete = useCallback((item: AdminMenuItem) => {
    setItems(prev => prev.filter(i => i.id !== item.id))
    showToast('info', `"${item.name}" removed from menu`)
  }, [showToast])

  const handleDuplicate = useCallback((item: AdminMenuItem) => {
    const cloned: AdminMenuItem = {
      ...item,
      id: `m${Date.now()}`,
      name: `${item.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setItems(prev => [cloned, ...prev])
    showToast('success', `"${cloned.name}" created`)
  }, [showToast])

  const toggleAvailable = useCallback((item: AdminMenuItem) => {
    setItems(prev =>
      prev.map(i =>
        i.id === item.id ? { ...i, available: !i.available } : i
      )
    )
    showToast('success', `"${item.name}" ${item.available ? 'hidden' : 'available'} now`)
  }, [showToast])

  const updateFormField = useCallback(<K extends keyof MenuFormData>(
    field: K, value: MenuFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const filterButtonClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
      active
        ? 'bg-amber/15 text-amber border border-amber/30'
        : 'text-mist/40 hover:text-mist/70 bg-white/5 border border-white/10'
    }`

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/50 transition-colors'

  const labelClass = 'block text-xs font-medium text-mist/60 uppercase tracking-wider mb-1.5'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-display text-3xl text-mist tracking-wide">Menu Management</h1>
      </div>

      <div className="section-panel rounded-2xl p-4 md:p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-mist/30"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-mist placeholder:text-mist/30 focus:outline-none focus:border-amber/50 transition-colors"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-mist focus:outline-none focus:border-amber/50 transition-colors"
          >
            {categoriesWithAll.map(cat => (
              <option key={cat} value={cat} className="bg-ink text-mist">
                {cat === 'All' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={e => setAvailabilityFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-mist focus:outline-none focus:border-amber/50 transition-colors"
          >
            {availabilityOptions.map(opt => (
              <option key={opt} value={opt} className="bg-ink text-mist">{opt === 'All' ? 'All Items' : opt}</option>
            ))}
          </select>

          <span className="text-sm text-mist/50 whitespace-nowrap font-body">
            {filteredItems.length} / {items.length} items
          </span>

          <button type="button" onClick={openAdd} className="btn-3d shrink-0">
            <span className="btn-3d-depth" />
            <span className="btn-3d-layer flex items-center gap-1.5 text-xs md:text-sm whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Item
            </span>
          </button>
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Name',
            sortable: true,
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return <span className="font-display text-mist font-medium">{i.name}</span>
            },
          },
          {
            key: 'category',
            header: 'Category',
            sortable: true,
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return (
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${categoryBadge[i.category]}`}>
                  {i.category.charAt(0).toUpperCase() + i.category.slice(1).replace('-', ' ')}
                </span>
              )
            },
          },
          {
            key: 'price',
            header: 'Price',
            sortable: true,
            width: '90px',
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return <span className="font-body text-mist/90">${i.price.toFixed(2)}</span>
            },
          },
          {
            key: 'discount',
            header: 'Discount',
            width: '90px',
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return (
                <span className={i.discount > 0 ? 'text-emerald-400 font-medium' : 'text-mist/40'}>
                  {i.discount > 0 ? `${i.discount}%` : '—'}
                </span>
              )
            },
          },
          {
            key: 'prepTime',
            header: 'Prep Time',
            sortable: true,
            width: '100px',
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return <span className="text-mist/70">{i.prepTime} min</span>
            },
          },
          {
            key: 'calories',
            header: 'Calories',
            sortable: true,
            width: '90px',
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return <span className="text-mist/70">{i.calories}</span>
            },
          },
          {
            key: 'available',
            header: 'Available',
            width: '80px',
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); toggleAvailable(i) }}
                  className="transition-transform hover:scale-110"
                  title={i.available ? 'Available - Click to hide' : 'Hidden - Click to show'}
                >
                  {i.available ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                </button>
              )
            },
          },
          {
            key: 'featured',
            header: 'Featured',
            width: '80px',
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return (
                <span>
                  {i.featured ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#c8a76a" stroke="#c8a76a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-mist/20">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  )}
                </span>
              )
            },
          },
          {
            key: 'actions',
            header: 'Actions',
            width: '140px',
            render: (item: Record<string, unknown>) => {
              const i = item as unknown as AdminMenuItem
              return (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); openView(i) }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-mist/40 hover:text-amber hover:bg-amber/10 transition-all"
                    title="View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); openEdit(i) }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-mist/40 hover:text-amber hover:bg-amber/10 transition-all"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleDuplicate(i) }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-mist/40 hover:text-amber hover:bg-amber/10 transition-all"
                    title="Duplicate"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleDelete(i) }}
                    className="w-7 h-7 flex items-center justify-center rounded-md text-mist/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              )
            },
          },
        ]}
        data={filteredItems as unknown as Record<string, unknown>[]}
        emptyMessage="No menu items match your filters."
        pageSize={10}
      />

      <Modal isOpen={modalMode === 'view'} onClose={closeModal} title={selectedItem?.name || 'Menu Item'} size="lg">
        {selectedItem && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <span className={labelClass}>Description</span>
              <p className="text-sm text-mist/70 leading-relaxed">{selectedItem.description || 'No description'}</p>
            </div>
            <div>
              <span className={labelClass}>Category</span>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryBadge[selectedItem.category]}`}>
                {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1).replace('-', ' ')}
              </span>
            </div>
            <div>
              <span className={labelClass}>Price</span>
              <p className="text-sm font-display text-amber text-lg">${selectedItem.price.toFixed(2)}</p>
            </div>
            <div>
              <span className={labelClass}>Discount</span>
              <p className={`text-sm font-medium ${selectedItem.discount > 0 ? 'text-emerald-400' : 'text-mist/40'}`}>
                {selectedItem.discount > 0 ? `${selectedItem.discount}% off` : 'No discount'}
              </p>
            </div>
            <div>
              <span className={labelClass}>Prep Time</span>
              <p className="text-sm text-mist/80">{selectedItem.prepTime} minutes</p>
            </div>
            <div>
              <span className={labelClass}>Calories</span>
              <p className="text-sm text-mist/80">{selectedItem.calories} cal</p>
            </div>
            <div>
              <span className={labelClass}>Available</span>
              <p className={`text-sm font-medium flex items-center gap-1.5 mt-1 ${selectedItem.available ? 'text-emerald-400' : 'text-red-400'}`}>
                {selectedItem.available ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg> Available</>
                ) : (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg> Unavailable</>
                )}
              </p>
            </div>
            <div>
              <span className={labelClass}>Featured</span>
              <p className={`text-sm font-medium flex items-center gap-1.5 mt-1 ${selectedItem.featured ? 'text-amber' : 'text-mist/40'}`}>
                {selectedItem.featured ? (
                  <><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#c8a76a" stroke="#c8a76a" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> Featured</>
                ) : 'Not featured'}
              </p>
            </div>
            <div>
              <span className={labelClass}>Hidden from Menu</span>
              <p className={`text-sm font-medium mt-1 ${selectedItem.hidden ? 'text-red-400' : 'text-emerald-400'}`}>
                {selectedItem.hidden ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <span className={labelClass}>Created</span>
              <p className="text-sm text-mist/60">{new Date(selectedItem.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalMode === 'add' || modalMode === 'edit'}
        onClose={closeModal}
        title={modalMode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
        size="xl"
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => updateFormField('name', e.target.value)}
                className={inputClass}
                placeholder="Item name"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                value={formData.description}
                onChange={e => updateFormField('description', e.target.value)}
                className={`${inputClass} min-h-[80px] resize-y`}
                placeholder="Item description"
                rows={3}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                value={formData.category}
                onChange={e => updateFormField('category', e.target.value as MenuCategory)}
                className={inputClass}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-ink text-mist">
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={e => updateFormField('price', parseFloat(e.target.value) || 0)}
                className={inputClass}
                placeholder="0.00"
              />
            </div>

            <div>
              <label className={labelClass}>Discount (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={e => updateFormField('discount', parseInt(e.target.value) || 0)}
                className={inputClass}
                placeholder="0"
              />
            </div>

            <div>
              <label className={labelClass}>Prep Time (min)</label>
              <input
                type="number"
                min="0"
                value={formData.prepTime}
                onChange={e => updateFormField('prepTime', parseInt(e.target.value) || 0)}
                className={inputClass}
                placeholder="0"
              />
            </div>

            <div>
              <label className={labelClass}>Calories</label>
              <input
                type="number"
                min="0"
                value={formData.calories}
                onChange={e => updateFormField('calories', parseInt(e.target.value) || 0)}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2 border-t border-white/10">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={e => updateFormField('available', e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber focus:ring-amber/50 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-mist/70 group-hover:text-mist transition-colors">Available</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={e => updateFormField('featured', e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber focus:ring-amber/50 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-mist/70 group-hover:text-mist transition-colors">Featured</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.hidden}
                onChange={e => updateFormField('hidden', e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber focus:ring-amber/50 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm text-mist/70 group-hover:text-mist transition-colors">Hidden from Menu</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg text-sm text-mist/50 hover:text-mist bg-white/5 hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-3d"
            >
              <span className="btn-3d-depth" />
              <span className="btn-3d-layer text-xs md:text-sm whitespace-nowrap">
                {modalMode === 'add' ? 'Add Item' : 'Save Changes'}
              </span>
            </button>
          </div>
        </div>
      </Modal>

      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[70] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => {
            const typeStyles: Record<string, { bg: string; border: string; icon: React.ReactNode }> = {
              success: {
                bg: 'bg-emerald-500/15',
                border: 'border-emerald-500/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400 shrink-0">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
              },
              info: {
                bg: 'bg-amber-500/15',
                border: 'border-amber-500/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                ),
              },
              error: {
                bg: 'bg-red-500/15',
                border: 'border-red-500/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                ),
              },
              warning: {
                bg: 'bg-yellow-500/15',
                border: 'border-yellow-500/30',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400 shrink-0">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                ),
              },
            }
            const style = typeStyles[toast.type] || typeStyles.info
            return (
              <div key={toast.id} className="pointer-events-auto animate-[fadeInScale_0.25s_ease-out]">
                <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${style.bg} ${style.border} backdrop-blur-md shadow-lg`}>
                  {style.icon}
                  <p className="text-sm text-mist flex-1 min-w-0">{toast.message}</p>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    className="shrink-0 text-mist/30 hover:text-mist transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
