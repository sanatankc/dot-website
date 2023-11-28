const commit = async (id, value) => {
  const res = await fetch('/saveData?id=' + id + '&value=' + value)
  const json = await res.json()
  return json
}
export default commit