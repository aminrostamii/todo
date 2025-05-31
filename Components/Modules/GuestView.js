import Link from "next/link";
import { FaRocket, FaPaintBrush, FaRegSmile } from "react-icons/fa";
import { FiLock, FiSmartphone, FiUserCheck } from "react-icons/fi";
import { MdOutlineQuestionAnswer } from "react-icons/md";

const GuestView = () => {
  return (
    <div dir="rtl" className="bg-gradient-to-br from-indigo-700 via-blue-800 to-blue-900 text-white min-h-screen overflow-x-hidden">

      {/* Hero Section */}
      <section className="flex items-center justify-center px-4 py-20">
        <div className="bg-white text-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center">
            <h1 className="text-4xl font-extrabold mb-4 text-right">مدیریت کارها به سبک حرفه‌ای!</h1>
            <p className="text-gray-600 mb-6 text-right leading-relaxed">
              با استفاده از وب‌سایت «تادیکس»، لیست کارهای خود را ساده و سریع مدیریت کنید.
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-start gap-4">
              <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg text-center font-medium transition-all duration-300">
                ورود به حساب
              </Link>
              <Link href="/register" className="border border-indigo-600 hover:bg-indigo-50 text-indigo-600 py-3 px-6 rounded-lg text-center font-medium transition-all duration-300">
                ثبت‌نام رایگان
              </Link>
            </div>
          </div>
          <div className="hidden lg:flex w-full lg:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/icons.png')" }} />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">چرا تادیکس؟</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "ساده و سریع", desc: "بدون پیچیدگی اضافی، فقط کارهایی که باید انجام بدی.", icon: <FaRocket size={30} /> },
            { title: "قابلیت شخصی‌سازی", desc: "رنگ، دسته‌بندی، یادآور و هر چیزی که نیاز داری.", icon: <FaPaintBrush size={30} /> },
            { title: "کاملا رایگان", desc: "بدون پرداخت، بدون تبلیغات. فقط مدیریت کارها.", icon: <FaRegSmile size={30} /> },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 rounded-xl p-6 shadow-md hover:bg-white/20 transition text-center">
              <div className="flex justify-center mb-4 text-indigo-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-200">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshot Section */}
      <section className="py-24 px-6 bg-blue-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">نمایی از محیط برنامه</h2>
          <img
            src="/app-preview-dark.jpg"
            alt="تصویر محیط برنامه"
            className="rounded-2xl shadow-lg border border-white/20"
          />
        </div>
      </section>

      {/* Testimonials Section
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">نظرات کاربران</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "رضا", quote: "واقعا ساده و کاربردیه. خیلی ازش استفاده می‌کنم!", avatar: "/avatars/reza.png" },
            { name: "نگار", quote: "تادیکس برنامه‌ریزی روزمره‌مو نجات داد.", avatar: "/avatars/negar.png" },
            { name: "امیر", quote: "همه‌چی توشه و کار باهاش لذت‌بخشه.", avatar: "/avatars/amir.png" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <img src={item.avatar} alt={item.name} className="w-10 h-10 rounded-full border border-white/20" />
                <h4 className="font-semibold text-white">- {item.name}</h4>
              </div>
              <p className="italic text-gray-100">"{item.quote}"</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-blue-950">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">سوالات متداول</h2>
          <div className="space-y-6">
            {[
              { q: "آیا ثبت‌نام رایگانه؟", a: "بله، استفاده از تادیکس کاملاً رایگان است.", icon: <FiUserCheck /> },
              { q: "آیا اطلاعات من امنه؟", a: "بله، اطلاعات شما رمزگذاری شده و محفوظ باقی می‌ماند.", icon: <FiLock /> },
              { q: "تادیکس نسخه موبایل هم داره؟", a: "بله، رابط کاربری ریسپانسیوه و در موبایل عالی کار می‌کنه.", icon: <FiSmartphone /> },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="text-indigo-300 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg text-indigo-300 mb-1">{item.q}</h3>
                  <p className="text-gray-200">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="py-12 text-center text-gray-400 text-sm border-t border-white/10">
        <p>© 2025 تادیکس - ساخته شده با ❤️ در ایران</p>
      </footer> */}
    </div>
  );
};

export default GuestView;
