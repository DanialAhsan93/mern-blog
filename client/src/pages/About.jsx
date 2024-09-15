import React from 'react';
import { useSelector } from 'react-redux'


export default function About() {
  const user1  = useSelector(state => state.user.currentUser);

  console.log(user1)

  return (
    <div>About</div>
  )
}
