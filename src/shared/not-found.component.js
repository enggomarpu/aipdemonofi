import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundComponent = () => {
    
    return (
        <>
            <h2>404</h2>
            <h1>Not Found</h1>
            <Link to="/">Back</Link>
        </>
    )
}

export default NotFoundComponent
