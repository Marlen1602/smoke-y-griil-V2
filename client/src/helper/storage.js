// Funciones para guardar y recuperar informacion localmente
export const saveJSON = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value))

export const loadJSON = (key, def = null) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? def
  } catch {
    return def
  }
}
