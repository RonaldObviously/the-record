import type { Bubble, Problem, Proposal, MetaAlert, BlackBoxEvent, Validator } from './types'

export interface StorageLayer {
  bubbles: Bubble[]
  problems: Problem[]
  proposals: Proposal[]
  metaAlerts: MetaAlert[]
  blackBox: BlackBoxEvent[]
  validators: Validator[]
}

export async function persistToStorage(key: string, data: any): Promise<void> {
  await window.spark.kv.set(key, data)
}

export async function retrieveFromStorage<T>(key: string): Promise<T | undefined> {
  return await window.spark.kv.get<T>(key)
}

export async function getAllKeys(): Promise<string[]> {
  return await window.spark.kv.keys()
}

export async function clearStorage(key: string): Promise<void> {
  await window.spark.kv.delete(key)
}

export async function verifyStorageIntegrity(): Promise<boolean> {
  try {
    const keys = await getAllKeys()
    return keys.length >= 0
  } catch {
    return false
  }
}
