import React from 'react'
import { homePageStyles } from '../../styles/homePage'
import { Box, Button, Typography } from '@mui/material'

function Footer() {
  return (
   <Box sx={homePageStyles.footerContainer}>
<Button variant='contained' sx={homePageStyles.footerBtn}>View Articles</Button>
<Typography sx={homePageStyles.footerText}>copyright @2025</Typography>
<Button variant='contained' sx={homePageStyles.footerBtn}>Publish</Button>

   </Box>
  )
}

export default Footer