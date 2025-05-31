import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const route = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.phone) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('ایمیل معتبر وارد کنید');
      return false;
    }
    if (formData.password.length < 6) {
      setError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.status === 'success') {
        alert('ثبت نام موفقیت‌آمیز بود!');
        localStorage.setItem("user", JSON.stringify(data.user));
        route.push("/login");
      } else {
        setError(data.message || 'خطای ناشناخته');
      }
    } catch (err) {
      setError('خطای اتصال به سرور');
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center lg:text-right">ایجاد حساب کاربری</h2>
          <p className="text-gray-600 mb-6 text-center lg:text-right">
            لطفاً اطلاعات زیر را وارد کنید.
          </p>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4 bg-red-100 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                name="fullName"
                placeholder="نام و نام خانوادگی"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Mail className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="ایمیل"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="رمز عبور"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <Phone className="absolute right-3 top-3.5 text-gray-400" size={18} />
              <input
                type="text"
                name="phone"
                placeholder="شماره تلفن"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md text-white font-medium transition-all duration-300 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'در حال ارسال...' : 'ثبت‌نام'}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600 text-center">
            حساب دارید؟ <Link href="/login" className="text-blue-600 hover:underline font-medium">وارد شوید</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

export async function getServerSideProps(context) {
  const accessToken = context.req.cookies.Access_Token;

  if (accessToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
}
