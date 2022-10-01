import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from "@mui/material";
import { useForm , FieldValues} from 'react-hook-form';
import agent from '../../app/api/agent';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../app/store/configureStore';
import { signInUser } from './accountSlice';
import { history } from '../..';

export default function Login() {
    const dispatch = useAppDispatch();
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors, isValid },
    } = useForm<{ username: "", password: "" }>({ mode: "all" }); //ให้บอก error all หรือทุกเมือ
    //FieldValues คือ ค่าทั้งหมดภายใน Form
    async function submitForm(data: FieldValues) {
        try {
            await dispatch(signInUser(data));
            history.push("/catalog"); //มาจาก index.tsx
        } catch (error) {
            console.log(error)
        }
    }
      

    return (
        <Container component={Paper}
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 4,
            }}
        >
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username Address"
              autoFocus
              {...register("username", { required: "Username is required" })}
              // !! คือ จริงหรือเท็ด || boolean 
              error={!!errors.username}
              helperText={errors?.username?.message}
            />
            <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...register("password", { required: "Password is required" })}
                        error={!!errors.password}
                        helperText={errors?.password?.message}
            
                    />
                    <LoadingButton   
                        disabled={!isValid}
                        loading={isSubmitting}
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </LoadingButton>
                    <Grid container>
                        <Grid item>
                            <Link href="#" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}