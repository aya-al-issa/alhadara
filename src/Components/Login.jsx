import { useState } from 'react';
import '../Style/login.css';
import loginIllustration from '../Assets/undraw_learning_qt7d.svg';
import { useAuth } from './Context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useLogin } from '../Components/Hook/useLogin.js';
import { useForm, Controller } from 'react-hook-form';
import Loading from './Loader/Loading.jsx';

const phoneRegex = /^(09\d{8}|\+9639\d{8}|009639\d{8})$/;

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  const loginMutation = useLogin(
    (data) => {
      setUser({ user_type: data.user_type, ...data.user });
      setErrorMsg('');
      setAttempts(0);

      setShowLoadingScreen(true); // فعل عرض شاشة التحميل

      setTimeout(() => {
        navigate('/dashboard/home');
      }, 1500); // تأخير 1.5 ثانية ثم الانتقال
    },
    (error) => {
      setAttempts(prev => prev + 1);
      if (attempts >= 3) {
        setErrorMsg('تم حظر المحاولة مؤقتاً، الرجاء الانتظار 30 ثانية');
        setTimeout(() => setAttempts(0), 30000);
      } else {
        setErrorMsg(error);
      }
    }
  );


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
    }
  });

  const validatePassword = (value) => {
    if (value.length < 8) return 'كلمة المرور يجب أن تكون على الأقل 8 أحرف';
    if (!/[A-Z]/.test(value)) return 'كلمة المرور يجب أن تحتوي على حرف كبير';
    if (!/[a-z]/.test(value)) return 'كلمة المرور يجب أن تحتوي على حرف صغير';
    if (!/[0-9]/.test(value)) return 'كلمة المرور يجب أن تحتوي على رقم';
    if (!/[^A-Za-z0-9]/.test(value)) return 'كلمة المرور يجب أن تحتوي على رمز خاص';
    return true;
  };

  const onSubmit = (data) => {
    if (attempts >= 3) return;

    setErrorMsg('');
    let formattedPhone = data.phone;

    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+963' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone;
    }

    loginMutation.mutate({
      phone: formattedPhone,
      password: data.password,
    });
  };


  if (showLoadingScreen) {
    return <Loading fullscreen text="جاري التحميل..." />;
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <img src={loginIllustration} alt="Login Illustration" />
        </div>
        <div className="login-right">
          <h2 className='title'>Sign In</h2>
          <form className='form-login' onSubmit={handleSubmit(onSubmit)}>

            <label>Phone Number</label>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'الرجاء إدخال رقم الهاتف.',
                validate: value => phoneRegex.test(value) || 'رقم غير صالح'
              }}
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="ُEnter your phone number"
                  {...field}
                />
              )}
            />
            {errors.phone && (
              <p style={{ color: 'red' }}>{errors.phone.message}</p>
            )}


            <label>Password</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'الرجاء إدخال كلمة المرور.',
                validate: validatePassword
              }}
              render={({ field }) => (
                <input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              )}
            />
            {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

            <a href="#" className="forgot-password"></a>

            <button
              type="submit"
              className="login-btn"
              disabled={loginMutation.isLoading || attempts >= 3}
            >
              {loginMutation.isLoading ? 'Logging in...' : 'LOGIN'}
            </button>

            {errorMsg && (
              <Alert severity="error" style={{ marginTop: '1rem' }}>
                {errorMsg}
              </Alert>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
