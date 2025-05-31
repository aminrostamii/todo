import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const route = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'خطا',
        text: 'لطفاً تمام فیلدها را پر کنید',
      });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'ایمیل نامعتبر',
        text: 'ایمیل معتبر وارد کنید',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    Swal.fire({
      title: 'لطفاً منتظر بمانید...',
      text: 'در حال بررسی اطلاعات شما',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      Swal.close();

      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'ورود موفقیت‌آمیز',
          text: 'خوش آمدید!',
        });

        localStorage.setItem('user', JSON.stringify(data.data));
        Cookies.set('Access_Token', data.data.token, { expires: 1, path: '/' });
        Cookies.set('userId', data.data.userId);
        route.push('/todo');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'خطا در ورود',
          text: data.message || 'خطای ناشناخته',
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'خطای سرور',
        text: 'خطای اتصال به سرور',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col lg:flex-row">

        {/* Right: Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/photo.jpg')" }} />

        {/* Left: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center lg:text-right">ورود به حساب</h2>
          <p className="text-gray-600 mb-6 text-center lg:text-right">
            لطفاً ایمیل و رمز عبور خود را وارد کنید.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="ایمیل"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="ایمیل"
            />

            <input
              type="password"
              name="password"
              placeholder="رمز عبور"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="رمز عبور"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md text-white font-medium transition-all duration-300 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            حساب ندارید؟ <Link href="/register" className="text-blue-600 hover:underline font-medium">ثبت‌نام</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

export async function getServerSideProps(context) {
  // Check if the Access_Token cookie exists on the server
  const accessToken = context.req.cookies.Access_Token;

  // If the token exists, redirect to the homepage
  if (accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // If no token, continue to render the register page
  return { props: {} };
}

