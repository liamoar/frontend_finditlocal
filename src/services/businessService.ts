import { supabase } from '@/lib/supabase'
import { Business, SearchFilters } from '@/types/business'

export interface PaginationOptions {
  page?: number
  pageSize?: number
  sortBy?: 'rating' | 'reviews' | 'name' | 'newest'
}

export interface PaginatedResult {
  businesses: Business[]
  totalCount: number
  totalPages: number
  currentPage: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export class BusinessService {
  // Existing method - keep for backward compatibility
  static async getBusinesses(filters: SearchFilters = {}): Promise<Business[]> {
    let query = supabase.from('businesses').select('*')
    
    if (filters.category) {
      const decodedCategory = decodeURIComponent(filters.category).replace(/-/g, ' ')
      query = query.eq('category', decodedCategory)
    }
    
    if (filters.area) {
      const decodedArea = decodeURIComponent(filters.area).replace(/-/g, ' ')
      query = query.eq('area', decodedArea)
    }
    
    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  // New paginated method
static async getBusinessesPaginated(
  filters: SearchFilters = {},
  options: PaginationOptions = {}
): Promise<PaginatedResult> {
  const {
    page = 1,
    pageSize = 20,
    sortBy = 'rating'
  } = options

  let query = supabase.from('businesses').select('*', { count: 'exact' })
  
  // Apply filters
  if (filters.category) {
    const decodedCategory = decodeURIComponent(filters.category).replace(/-/g, ' ')
    query = query.eq('category', decodedCategory)
  }
  
  if (filters.area) {
    const decodedArea = decodeURIComponent(filters.area).replace(/-/g, ' ')
    query = query.eq('area', decodedArea)
  }
  
  if (filters.query) {
    query = query.ilike('name', `%${filters.query}%`)
  }
  
  // CRITICAL FIX: Filter out NULL ratings when sorting by rating/reviews
  if (sortBy === 'rating' || sortBy === 'reviews') {
    query = query.not('rating', 'is', null)
  }
  
  // Apply sorting
  switch (sortBy) {
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'reviews':
      query = query.order('reviews', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    default:
      query = query.order('rating', { ascending: false })
  }
  
  // Apply pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  query = query.range(from, to)
  
  const { data, error, count } = await query
  
  if (error) throw error

  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / pageSize)
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  return {
    businesses: data || [],
    totalCount,
    totalPages,
    currentPage: page,
    hasNextPage,
    hasPrevPage
  }
}

  // Get businesses with proper null handling for ratings
  static async getBusinessesWithRating(
    filters: SearchFilters = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult> {
    const {
      page = 1,
      pageSize = 20,
      sortBy = 'rating'
    } = options

    let query = supabase.from('businesses').select('*', { count: 'exact' })
    
    // Apply filters
    if (filters.category) {
      const decodedCategory = decodeURIComponent(filters.category).replace(/-/g, ' ')
      query = query.eq('category', decodedCategory)
    }
    
    if (filters.area) {
      const decodedArea = decodeURIComponent(filters.area).replace(/-/g, ' ')
      query = query.eq('area', decodedArea)
    }
    
    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`)
    }
    
    // Filter out businesses without ratings for better sorting
    if (sortBy === 'rating' || sortBy === 'reviews') {
      query = query.not('rating', 'is', null)
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'reviews':
        query = query.order('reviews', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
    }
    
    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)
    
    const { data, error, count } = await query
    
    if (error) throw error

    const totalCount = count || 0
    const totalPages = Math.ceil(totalCount / pageSize)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    return {
      businesses: data || [],
      totalCount,
      totalPages,
      currentPage: page,
      hasNextPage,
      hasPrevPage
    }
  }

  // Get businesses with simple sorting (for smaller result sets)
  static async getBusinessesSorted(
    filters: SearchFilters = {},
    sortBy: 'rating' | 'reviews' | 'name' | 'newest' = 'rating',
    limit: number = 100
  ): Promise<Business[]> {
    let query = supabase.from('businesses').select('*')
    
    // Apply filters
    if (filters.category) {
      const decodedCategory = decodeURIComponent(filters.category).replace(/-/g, ' ')
      query = query.eq('category', decodedCategory)
    }
    
    if (filters.area) {
      const decodedArea = decodeURIComponent(filters.area).replace(/-/g, ' ')
      query = query.eq('area', decodedArea)
    }
    
    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`)
    }
    
    // For rating/reviews, filter out nulls for better results
    if (sortBy === 'rating' || sortBy === 'reviews') {
      query = query.not('rating', 'is', null)
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'reviews':
        query = query.order('reviews', { ascending: false })
        break
      case 'name':
        query = query.order('name', { ascending: true })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
    }
    
    // Apply limit
    query = query.limit(limit)
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  static async getUniqueCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('category')
      .not('category', 'is', null)
    
    if (error) throw error
    return [...new Set(data?.map(item => item.category).filter(Boolean))] as string[]
  }

  static async getUniqueAreas(): Promise<string[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('area')
      .not('area', 'is', null)
    
    if (error) throw error
    return [...new Set(data?.map(item => item.area).filter(Boolean))] as string[]
  }

  static async getBusinessById(id: number): Promise<Business | null> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) return null
    return data
  }

  static async getBusinessesByCategoryAndArea(category: string, area: string): Promise<Business[]> {
    const decodedCategory = decodeURIComponent(category).replace(/-/g, ' ')
    const decodedArea = decodeURIComponent(area).replace(/-/g, ' ')
    
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('category', decodedCategory)
      .eq('area', decodedArea)

    if (error) throw error
    return data || []
  }

  // Get popular businesses (highly rated with many reviews)
  static async getPopularBusinesses(limit: number = 12): Promise<Business[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .not('rating', 'is', null)
      .not('reviews', 'is', null)
      .gte('reviews', 10) // At least 10 reviews
      .order('rating', { ascending: false })
      .order('reviews', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Get businesses without ratings (for completeness)
  static async getBusinessesWithoutRatings(limit: number = 50): Promise<Business[]> {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .is('rating', null)
      .limit(limit)

    if (error) throw error
    return data || []
  }
}