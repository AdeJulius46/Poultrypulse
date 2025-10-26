// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Handle both Next.js and Vite environment variables
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.VITE_PUBLIC_SUPABASE_URL || 
  (typeof window !== 'undefined' && (window as any).env?.VITE_PUBLIC_SUPABASE_URL) ||
  ''

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.VITE_PUBLIC_SUPABASE_ANON_KEY || 
  (typeof window !== 'undefined' && (window as any).env?.VITE_PUBLIC_SUPABASE_ANON_KEY) ||
  ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback configuration for development.')
  // Don't throw error in development - just warn
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for chicken monitoring data
export interface ChickenMonitoring {
  id: string
  timestamp: string
  
  // Environmental data
  temperature: number
  humidity: number
  
  // Detection counts (current frame)
  coryza_detected: number
  crd_detected: number
  normal_detected: number
  
  // Cumulative counts (session totals)
  total_coryza_count: number
  total_crd_count: number
  total_normal_count: number
  
  // Risk assessment
  outbreak_risk: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  alert_message?: string
  
  // Individual detection data
  detected_disease?: string
  confidence?: number
  detection_id?: string
  
  // Image storage
  image_path?: string
  image_url?: string
  
  // Metadata
  created_at: string
  updated_at: string
}

export interface DetectionSession {
  id: string
  session_start: string
  session_end?: string
  total_detections: number
  max_risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'ACTIVE' | 'COMPLETED' | 'STOPPED'
  notes?: string
  created_at: string
}

export interface AlertThreshold {
  id: string
  parameter_name: string
  min_value?: number
  max_value?: number
  alert_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  message?: string
  is_active: boolean
  created_at: string
}

export interface LatestReading {
  id: string
  timestamp: string
  temperature: number
  humidity: number
  outbreak_risk: number
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  calculated_risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  coryza_detected: number
  crd_detected: number
  normal_detected: number
  alert_message?: string
  detected_disease?: string
  confidence?: number
  image_url?: string
}

export interface DailySummary {
  monitoring_date: string
  total_records: number
  avg_temperature: number
  avg_humidity: number
  max_outbreak_risk: number
  total_coryza_detections: number
  total_crd_detections: number
  total_normal_detections: number
  critical_alerts: number
  high_alerts: number
}

export interface DetectionWithImage {
  id: string
  timestamp: string
  detected_disease: string
  confidence: number
  image_url: string
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  temperature: number
  humidity: number
  outbreak_risk: number
}

export interface FlockStatistics {
  total_chickens: number
  healthy_count: number
  at_risk_count: number
  critical_count: number
  latest_detection_time: string
  avg_temperature: number
  avg_humidity: number
  total_detections_today: number
}

// Utility function to generate random environmental values for demo
const generateRandomEnvironmental = () => ({
  temperature: 20 + Math.random() * 15, // 20-35°C
  humidity: 50 + Math.random() * 30, // 50-80%
})

// Database functions
export const insertChickenMonitoring = async (data: Partial<ChickenMonitoring>) => {
  const { data: result, error } = await supabase
    .from('chicken_monitoring')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('Error inserting chicken monitoring data:', error)
    throw error
  }

  return result
}

export const fetchChickenMonitoring = async (
  limit: number = 50,
  riskLevel?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<ChickenMonitoring[]> => {
  let query = supabase
    .from('chicken_monitoring')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit)

  // Apply risk level filter
  if (riskLevel && riskLevel !== 'ALL') {
    query = query.eq('risk_level', riskLevel)
  }

  // Apply date filters
  if (dateFrom) {
    query = query.gte('timestamp', dateFrom)
  }
  if (dateTo) {
    query = query.lte('timestamp', dateTo)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching chicken monitoring data:', error)
    throw error
  }

  return data || []
}

// Specialized function to fetch only records with disease detections and images
export const fetchDetectionsWithImages = async (
  limit: number = 5,
  diseaseTypes: string[] = ['crd', 'coryza']
): Promise<DetectionWithImage[]> => {
  let query = supabase
    .from('chicken_monitoring')
    .select('id, timestamp, detected_disease, confidence, image_url, risk_level, temperature, humidity, outbreak_risk')
    .not('image_url', 'is', null)
    .not('detected_disease', 'is', null)
    .gt('confidence', 0.5) // Only confident detections
    .in('detected_disease', diseaseTypes)
    .order('timestamp', { ascending: false })
    .limit(limit)

  const { data, error } = await query

  if (error) {
    console.error('Error fetching detections with images:', error)
    throw error
  }

  return data || []
}

// Function to get comprehensive flock statistics
export const getFlockStatistics = async (): Promise<FlockStatistics | null> => {
  try {
    // Get recent data for statistics (last 24 hours)
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)
    
    const { data: recentData, error } = await supabase
      .from('chicken_monitoring')
      .select('*')
      .gte('timestamp', oneDayAgo.toISOString())
      .order('timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching flock statistics:', error)
      return null
    }

    if (!recentData || recentData.length === 0) {
      return {
        total_chickens: 0,
        healthy_count: 0,
        at_risk_count: 0,
        critical_count: 0,
        latest_detection_time: new Date().toISOString(),
        avg_temperature: 0,
        avg_humidity: 0,
        total_detections_today: 0
      }
    }

    // Calculate statistics
    let totalHealthy = 0
    let totalAtRisk = 0
    let totalCritical = 0
    let totalTemp = 0
    let totalHumidity = 0
    let detectionsToday = 0

    recentData.forEach(record => {
      const normalCount = record.normal_detected || 0
      const coryzeCount = record.coryza_detected || 0
      const crdCount = record.crd_detected || 0
      
      totalHealthy += normalCount
      
      if (record.risk_level === 'HIGH' || record.risk_level === 'CRITICAL') {
        totalCritical += (coryzeCount + crdCount)
      } else if (record.risk_level === 'MEDIUM') {
        totalAtRisk += (coryzeCount + crdCount)
      } else {
        totalAtRisk += (coryzeCount + crdCount)
      }

      totalTemp += record.temperature
      totalHumidity += record.humidity
      
      if (record.detected_disease) {
        detectionsToday++
      }
    })

    const totalChickens = totalHealthy + totalAtRisk + totalCritical
    const avgTemp = recentData.length > 0 ? totalTemp / recentData.length : 0
    const avgHumidity = recentData.length > 0 ? totalHumidity / recentData.length : 0

    return {
      total_chickens: totalChickens,
      healthy_count: totalHealthy,
      at_risk_count: totalAtRisk,
      critical_count: totalCritical,
      latest_detection_time: recentData[0]?.timestamp || new Date().toISOString(),
      avg_temperature: avgTemp,
      avg_humidity: avgHumidity,
      total_detections_today: detectionsToday
    }

  } catch (error) {
    console.error('Error calculating flock statistics:', error)
    return null
  }
}

export const fetchLatestReadings = async (): Promise<LatestReading[]> => {
  const { data, error } = await supabase
    .from('latest_readings')
    .select('*')
    .limit(10)

  if (error) {
    console.error('Error fetching latest readings:', error)
    throw error
  }

  return data || []
}

export const fetchDailySummary = async (days: number = 7): Promise<DailySummary[]> => {
  const { data, error } = await supabase
    .from('daily_summary')
    .select('*')
    .limit(days)

  if (error) {
    console.error('Error fetching daily summary:', error)
    throw error
  }

  return data || []
}

export const getLatestStatus = async () => {
  const { data, error } = await supabase.rpc('get_latest_status')

  if (error) {
    console.error('Error fetching latest status:', error)
    throw error
  }

  return data?.[0] || null
}

export const fetchDetectionSessions = async (): Promise<DetectionSession[]> => {
  const { data, error } = await supabase
    .from('detection_sessions')
    .select('*')
    .order('session_start', { ascending: false })

  if (error) {
    console.error('Error fetching detection sessions:', error)
    throw error
  }

  return data || []
}

export const createDetectionSession = async (session: Partial<DetectionSession>) => {
  const { data, error } = await supabase
    .from('detection_sessions')
    .insert([session])
    .select()
    .single()

  if (error) {
    console.error('Error creating detection session:', error)
    throw error
  }

  return data
}

export const updateDetectionSession = async (id: string, updates: Partial<DetectionSession>) => {
  const { data, error } = await supabase
    .from('detection_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating detection session:', error)
    throw error
  }

  return data
}

export const fetchAlertThresholds = async (): Promise<AlertThreshold[]> => {
  const { data, error } = await supabase
    .from('alert_thresholds')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching alert thresholds:', error)
    throw error
  }

  return data || []
}

// Real-time subscription for chicken monitoring
export const subscribeToChickenMonitoring = (
  callback: (payload: any) => void
) => {
  return supabase
    .channel('chicken_monitoring')
    .on(
      'postgres_changes',
      {
        event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'chicken_monitoring'
      },
      callback
    )
    .subscribe()
}

// Real-time subscription for detection sessions
export const subscribeToDetectionSessions = (
  callback: (payload: any) => void
) => {
  return supabase
    .channel('detection_sessions')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'detection_sessions'
      },
      callback
    )
    .subscribe()
}

// Clean up old records (wrapper for the database function)
export const cleanupOldRecords = async (daysToKeep: number = 30) => {
  const { data, error } = await supabase.rpc('cleanup_old_records', {
    days_to_keep: daysToKeep
  })

  if (error) {
    console.error('Error cleaning up old records:', error)
    throw error
  }

  return data
}

// Additional utility functions for the enhanced recommendations section

// Function to get disease-specific recommendations
export const getDiseaseRecommendations = (detectedDiseases: string[], environmentalData: { avgTemp: number, avgHumidity: number }): string[] => {
  const recommendations: string[] = []
  
  const hasCoryza = detectedDiseases.includes('coryza')
  const hasCrd = detectedDiseases.includes('crd')
  const { avgTemp, avgHumidity } = environmentalData

  // Disease-specific recommendations
  if (hasCoryza) {
    recommendations.push('Isolate affected birds immediately to prevent coryza spread.')
    recommendations.push('Administer appropriate antibiotics as prescribed by veterinarian.')
    recommendations.push('Improve ventilation system to reduce airborne transmission.')
  }
  
  if (hasCrd) {
    recommendations.push('Implement strict biosecurity measures to contain respiratory disease.')
    recommendations.push('Monitor air quality and reduce dust levels in poultry house.')
    recommendations.push('Consider vaccination program for unaffected birds.')
  }

  // Environmental recommendations
  if (avgTemp > 30) {
    recommendations.push('Increase airflow in poultry house to reduce heat stress.')
    recommendations.push('Provide shade and cooling systems during hot weather.')
  } else if (avgTemp < 18) {
    recommendations.push('Ensure adequate heating to maintain optimal temperature.')
  }

  if (avgHumidity > 70) {
    recommendations.push('Clean and dry litter to minimize moisture buildup.')
    recommendations.push('Improve drainage systems to control humidity levels.')
    recommendations.push('Increase ventilation to reduce moisture accumulation.')
  } else if (avgHumidity < 40) {
    recommendations.push('Monitor for respiratory irritation due to low humidity.')
  }

  // General health recommendations
  recommendations.push('Provide clean, fresh drinking water at all times.')
  recommendations.push('Disinfect water lines regularly to prevent bacterial growth.')
  recommendations.push('Maintain consistent feeding schedule with balanced nutrition.')
  recommendations.push('Regular health monitoring and record keeping.')

  // Return only unique recommendations, limited to 6-8 items
  return [...new Set(recommendations)].slice(0, 8)
}

// Function to calculate risk-based percentages
export const calculateFlockPercentages = (healthyCount: number, atRiskCount: number, criticalCount: number) => {
  const total = healthyCount + atRiskCount + criticalCount
  
  if (total === 0) {
    return {
      healthyPercentage: '0%',
      atRiskPercentage: '0%',
      criticalPercentage: '0%'
    }
  }
  
  return {
    healthyPercentage: `${Math.round((healthyCount / total) * 100)}%`,
    atRiskPercentage: `${Math.round((atRiskCount / total) * 100)}%`,
    criticalPercentage: `${Math.round((criticalCount / total) * 100)}%`
  }
}

// Function to format confidence score for display
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`
}

// Function to format timestamps for display
export const formatDetectionTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) {
    return 'Just now'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`
  } else if (diffInMinutes < 1440) {
    return `${Math.floor(diffInMinutes / 60)} hr ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Function to get risk level styling
export const getRiskLevelStyling = (riskLevel: string) => {
  switch (riskLevel) {
    case 'CRITICAL':
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      }
    case 'HIGH':
      return {
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-200'
      }
    case 'MEDIUM':
      return {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
      }
    default:
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      }
  }
}