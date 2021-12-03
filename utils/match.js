import workCategories from './workCategories'

export const matchWorkCategories = (categories) => {

  let labels = []
  
  workCategories.forEach( (item) => {
    if(categories.indexOf(item.id) !== -1) return labels.push(item.label)
  })

  return labels
  console.log(labels)
}