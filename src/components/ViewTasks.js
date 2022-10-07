import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FixedSizeList from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import TaskIcon from '@mui/icons-material/Task';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { Container, Typography } from '@mui/material';

const theme = createTheme();

export default function ViewTasks() {
    return (
        <ThemeProvider theme={theme}>
                <Container component="main" maxWidth="lg">
                    <Box sx={{ mt: 6 }} display="flex" style={{textAlign: "center"}}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={50} sm={12} lg={'50%'}>
                                <FixedSizeList sx={{border: 1, borderColor:'black',maxHeight:600, overflowY:'auto',flexGrow: 1,
        flexDirection:"column",}} height={400}>
                                    {[1,2,3,4,5,6,7,8,9,10].map((value) => (
                                        <div>
                                            <Button sx={{ height: '100%', width: '100%'}}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <TaskIcon color="grey"/>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`Task ${value}`} secondary="Project Name"/>   
                                                </ListItem>
                                            </Button>
                                            <Divider />
                                        </div>
                                    ))}
                                </FixedSizeList>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            </ThemeProvider>
        
    );
}