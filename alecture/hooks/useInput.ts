import { Dispatch, SetStateAction, useCallback, useState } from "react"

type Handler = (e: any) => void
type ReturnTypes<T = any> = [T, Handler, Dispatch<SetStateAction<T>>]

const useInput = <T = any>(initialValue: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialValue)
  const handleChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])
  return [value, handleChange, setValue]
}

export default useInput
