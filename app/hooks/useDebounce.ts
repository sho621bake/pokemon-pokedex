import { useState, useEffect } from 'react';

/**
 * 値の変更を遅延させるカスタムフック
 * @param value 監視する値
 * @param delay 遅延時間（ミリ秒）
 * @returns 遅延された値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 指定された遅延後に値を更新するタイマーを設定
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ関数でタイマーをクリア
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
