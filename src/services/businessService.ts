import { supabase } from '../lib/supabase'
import { Business, SearchFilters } from '../types/business'

export class BusinessService {
  static async getBusinesses(filters: SearchFilters = {}): Promise<Business[]> {
    let query = supabase.from('businesses').select('*')
    
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    
    if (filters.area) {
      query = query.eq('area', filters.area)
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
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('category', category)
      .eq('area', area)
    
    if (error) throw error
    return data || []
  }
}