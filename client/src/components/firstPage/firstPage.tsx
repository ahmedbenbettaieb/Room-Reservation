import Menu from '@/pages/Menu/menu'
import { fetchAllUsers } from '@/pages/redux/allUsers/allUsersSlice';
import { useAppDispatch, useAppSelector } from '@/pages/redux/store'
import  { useEffect } from 'react'

export default function FirstPage() {
  const { user } = useAppSelector((state) => state.user)
  const dispatch=useAppDispatch();
  useEffect(() => {
    dispatch(fetchAllUsers())
  },[])
  return (
    <Menu>

<div>Welcome {user?.name}   To Ulysse Room Reservation System</div>

    </Menu>
  )
}
