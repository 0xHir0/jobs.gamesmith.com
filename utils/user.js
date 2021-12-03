export const getUser = (req) => {
  if(!req.headers.cookie){
    return undefined
  }

  let user = req.headers.cookie

  if(!user){
      return undefined
  }

  const array = new Array(user.split(';'))

  const newArray = array[0].map( (i) => {
    return i.trim()
  })

  let parsedUser = newArray.find( a => a.includes("user"))

  return parsedUser
}