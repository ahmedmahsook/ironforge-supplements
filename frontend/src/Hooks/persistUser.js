import api from "../api/api"

export async function persistUser(userId, fields) {
  const { data } = await api.patch(`/users/${userId}`, {
    ...fields,
    updatedAt: new Date().toISOString(),
  })

  return data
}
