import { homePageStyles } from '../../styles/homePage'
import { Box, Typography } from '@mui/material'

function HomePage() {
  return (
    <Box sx={homePageStyles.container}>

<Box sx={homePageStyles.wrapper}>
    <Typography sx={homePageStyles.text}>Write and Share Your Articles</Typography>
    <img width={'50%'} height={'50%'}
    //@ts-ignore
    style={homePageStyles.image}  src="/blog.png" alt='blog post 1'/>
</Box>
<Box sx={homePageStyles.wrapper}>
    <Typography sx={homePageStyles.text}>Write and Share Your Articles</Typography>
    <img width={'50%'} height={'50%'}
    //@ts-ignore
    style={homePageStyles.image}  src="/publish.png" alt='blog post 2'/>
</Box>
<Box sx={homePageStyles.wrapper}>
    <Typography sx={homePageStyles.text}>Write and Share Your Articles</Typography>
    <img width={'50%'} height={'50%'}
    //@ts-ignore
    style={homePageStyles.image}  src="/articles.png" alt='blog post 3'/>
</Box>



    </Box>
  )
}

export default HomePage