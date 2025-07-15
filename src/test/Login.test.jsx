import { useState } from 'react';
import '../Style/login.css';
import loginIllustration from '../Assets/undraw_learning_qt7d.svg';

import { useAuth } from '../Components/Context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { useLogin } from '../Components/Hook/useLogin.js';
import { useForm, Controller } from 'react-hook-form';

const phoneRegex = /^(\+?9639\d{8}|09\d{8})$/;

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');

  const loginMutation = useLogin(
    (data) => {
      setUser({ user_type: data.user_type, ...data.user });
      setErrorMsg('');
      navigate('/dashboard/home');
    },
    (error) => {
      setErrorMsg(error);
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

  // دالة تحقق كلمة المرور حسب الشروط:
  const validatePassword = (value) => {
    if (value.length < 8) {
      return 'كلمة المرور يجب أن تكون على الأقل 8 أحرف';
    }
    if (!/[A-Z]/.test(value)) {
      return 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل';
    }
    if (!/[a-z]/.test(value)) {
      return 'كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل';
    }
    if (!/[0-9]/.test(value)) {
      return 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل';
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل';
    }
    return true;
  };
  // دالة submit
  const onSubmit = (data) => {
    setErrorMsg('');

    // إصلاح رقم الهاتف ليبدأ ب + إذا لم يبدأ
    let formattedPhone = data.phone;
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        // استبدال 0 بـ +963 (مثلاً 0933XXXXXXX => +963933XXXXXXX)
        formattedPhone = '+963' + formattedPhone.substring(1);
      } else {
        formattedPhone = '+' + formattedPhone;
      }
    }
    const loginData = {
      phone: formattedPhone,
      password: data.password,
    };
    console.log('بيانات تسجيل الدخول:', loginData);

    loginMutation.mutate({
      phone: formattedPhone,
      password: data.password,
    });

  };

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
                validate: (value) => {
                  const phone = value.startsWith('+') ? value : `+${value}`;
                  return phoneRegex.test(phone) || 'الرجاء إدخال رقم سوري صحيح (09XXXXXXXX أو +9639XXXXXXXX)';
                }
              }}
              render={({ field }) => (
                <PhoneInput
                  country={'sy'}
                  value={field.value}
                  onChange={field.onChange}
                  inputStyle={{
                    width: '100%',
                    borderRadius: '6px',
                    padding: '25px 40px',
                    boxSizing: 'border-box',
                  }}
                  inputProps={{
                    name: 'phone',
                    required: true,
                    autoFocus: true,
                  }}
                />
              )}
            />
            {errors.phone && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>{errors.phone.message}</p>
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
            {errors.password && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>{errors.password.message}</p>
            )}

            <a href="#" className="forgot-password">Forgot Password?</a>

            <button
              type="submit"
              className="login-btn"
              disabled={loginMutation.isLoading}
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
