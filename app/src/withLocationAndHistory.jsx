import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const withLocationAndHistory = (Component) => (props) => {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  return (
    <Component
      {...{
        navigate,
        location,
        match: { params },
        ...props
      }}
    />
  )
}

export default withLocationAndHistory
