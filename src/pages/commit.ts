const commit = async (id, value) => {
  const cmsContent = localStorage.getItem('cmsContent')
  const cmsContentJson = JSON.parse(cmsContent)
  cmsContentJson[id] = value
  localStorage.setItem('cmsContent', JSON.stringify(cmsContentJson))
  const res = await fetch('/saveData?id=' + id + '&value=' + value)
  const json = await res.json()
  return json
}
export default commit