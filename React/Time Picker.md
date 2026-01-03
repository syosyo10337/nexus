 

# Time Picker

```TypeScript
import type { DayPicker } from 'react-day-picker'

import type { Button } from '@/shared/components/ui/button'
/**
 * Shadcn CalendarのPropsのエイリアス
 * NOTE: Shadcn addした型をそのままエイリアスしている
 * cf. https://ui.shadcn.com/docs/components/calendar
 */
type ShadcnCalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}

/**
 * カスタムCalendarに必要なDateではなくISO文字列でやり取りするためのProps
 */
export interface ISODateCalendarProps {
  /**
   * 選択された日付（ISO文字列）
   */
  selected?: string | string[]

  /**
   * 日付選択時のコールバック（ISO文字列を返す）
   */
  onSelect?: (date: string | string[] | undefined) => void

  /**
   * デフォルトの月（ISO文字列）
   */
  defaultMonth?: string

  /**
   * 現在の月（ISO文字列）
   */
  month?: string

  /**
   * 月変更時のコールバック（ISO文字列を返す）
   */
  onMonthChange?: (month: string) => void
}

export type CustomCalendarProps =
  Omit<ShadcnCalendarProps, keyof ISODateCalendarProps> &
  ISODateCalendarProps
```

```TypeScript
import * as React from 'react'

import type { PartialToUndefined } from '@/shared/types/utilities'
import {
  dateArrayToIsoArray,
  dateToIso,
  isoArrayToDateArray,
  isoToDate,
} from '@/shared/utils/adapters/calendar'

import type { ISODateCalendarProps } from './type'

interface UseCalendarAdapterProps extends PartialToUndefined<ISODateCalendarProps> {
  mode: 'single' | 'multiple' | 'range'
}

interface UseCalendarAdapterReturn {
  dateSelected: Date | Date[] | undefined
  dateDefaultMonth: Date | undefined
  dateMonth: Date | undefined
  handleSelect: (date: Date | Date[] | undefined) => void
  handleMonthChange: (month: Date) => void
}
/**
 * Calendarコンポーネント用のアダプターフック
 * ISO文字列とDateオブジェクトの変換を管理する
 */
export function useCalendarAdapter({
  selected,
  onSelect,
  defaultMonth,
  month,
  onMonthChange,
  mode,
}: UseCalendarAdapterProps): UseCalendarAdapterReturn {
  // ISO文字列からDateオブジェクトへの変換
  const dateSelected = React.useMemo(() => {
    if (mode === 'single') {
      return isoToDate(selected as string | undefined)
    } else if (mode === 'multiple') {
      return isoArrayToDateArray(selected as string[] | undefined)
    }
    // rangeモードの場合は、DayPickerが期待する形式に合わせて変換が必要
    return undefined
  }, [selected, mode])

  const dateDefaultMonth = React.useMemo(
    () => isoToDate(defaultMonth),
    [defaultMonth],
  )

  const dateMonth = React.useMemo(
    () => isoToDate(month),
    [month],
  )

  // DateオブジェクトからISO文字列への変換を行うハンドラー
  const handleSelect = React.useCallback((date: Date | Date[] | undefined) => {
    if (!onSelect) return

    if (mode === 'single') {
      onSelect(dateToIso(date as Date | undefined))
    } else if (mode === 'multiple') {
      onSelect(dateArrayToIsoArray(date as Date[] | undefined))
    }
  }, [onSelect, mode])

  const handleMonthChange = React.useCallback((month: Date) => {
    if (!onMonthChange) return
    onMonthChange(dateToIso(month)!)
  }, [onMonthChange])

  return {
    dateSelected,
    dateDefaultMonth,
    dateMonth,
    handleSelect,
    handleMonthChange,
  }
}
```