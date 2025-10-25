import { supabase } from '../lib/supabase'
import { Business, SearchFilters } from '../types/business'

export class BusinessService {
  static async getBusinesses(filters: SearchFilters = {}): Promise<Business[]> {
    let query = supabase.from('businesses').select('*')
    
    if (filters.category) {
      // Handle URL-encoded spaces (%20) and convert to regular spaces
      const decodedCategory = decodeURIComponent(filters.category).replace(/-/g, ' ')
      query = query.eq('category', decodedCategory)
    }
    
    if (filters.area) {
      // Handle URL-encoded spaces (%20) and convert to regular spaces
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
}