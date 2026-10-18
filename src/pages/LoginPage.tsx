import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/FormField';
import { ErrorMessage } from '../components/ErrorMessage';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<unknown>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      await login(data.email, data.password);
      // חוזרים לעמוד שממנו הגיעו, או לקטלוג
      navigate((location.state as { from?: string } | null)?.from ?? '/', { replace: true });
    } catch (e) {
      setError(e);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>התחברות</h2>
      <FormField label="אימייל" error={errors.email}>
        <input type="email" {...register('email', {
          required: 'נא להזין אימייל',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'אימייל לא תקין' },
        })} />
      </FormField>
      <FormField label="סיסמה" error={errors.password}>
        <input type="password" {...register('password', { required: 'נא להזין סיסמה' })} />
      </FormField>
      <ErrorMessage error={error} />
      <button className="btn btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'מתחבר...' : 'התחברות'}
      </button>
      <p>אין לך חשבון? <Link to="/register">להרשמה</Link></p>
    </form>
  );
}
