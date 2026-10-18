import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { authApi, type RegisterData } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/FormField';
import { ErrorMessage } from '../components/ErrorMessage';

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    setError(null);
    try {
      await authApi.register(data);
      await login(data.email, data.password);   // אחרי הרשמה מתחברים מיד
      navigate('/', { replace: true });
    } catch (e) {
      setError(e);   // למשל 409: האימייל כבר רשום
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>הרשמה</h2>
      <FormField label="שם פרטי" error={errors.firstName}>
        <input {...register('firstName', { required: 'שדה חובה', maxLength: { value: 50, message: 'עד 50 תווים' } })} />
      </FormField>
      <FormField label="שם משפחה" error={errors.lastName}>
        <input {...register('lastName', { required: 'שדה חובה', maxLength: { value: 50, message: 'עד 50 תווים' } })} />
      </FormField>
      <FormField label="אימייל" error={errors.email}>
        <input type="email" {...register('email', {
          required: 'שדה חובה',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'אימייל לא תקין' },
        })} />
      </FormField>
      <FormField label="טלפון" error={errors.phone}>
        <input {...register('phone', {
          required: 'שדה חובה',
          pattern: { value: /^0\d{8,9}$/, message: 'טלפון לא תקין (למשל 0521234567)' },
        })} />
      </FormField>
      <FormField label="סיסמה" error={errors.password}>
        <input type="password" {...register('password', {
          required: 'שדה חובה',
          minLength: { value: 6, message: 'לפחות 6 תווים' },
        })} />
      </FormField>
      <ErrorMessage error={error} />
      <button className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'נרשם...' : 'הרשמה'}
      </button>
      <p>כבר רשומה? <Link to="/login">להתחברות</Link></p>
    </form>
  );
}
