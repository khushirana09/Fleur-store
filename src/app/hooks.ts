import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

/**
 * Use this instead of plain `useDispatch` to get full TypeScript support.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * Use this instead of plain `useSelector` to get full TypeScript support.
 */
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector<RootState, T>(selector)