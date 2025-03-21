import { v4 as uuidv4 } from "uuid"

const items = []

export const addItem = (item) => {
  const id = uuidv4()
  items.push({ ...item, id })
  return id
}

