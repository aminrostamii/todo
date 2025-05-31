import Head from "next/head";

export default function Support() {
  return (
    <>
      <Head>
        <title>پشتیبانی</title>
      </Head>
      <div className="min-h-screen bg-blue-600 p-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4 text-center">پشتیبانی</h1>
          <p className="mb-6 text-gray-700 text-center">
            اگر سوال یا مشکلی دارید، لطفاً از طریق فرم زیر با ما در تماس باشید.
          </p>

          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">نام</label>
              <input
                type="text"
                className="w-full border p-2 rounded-md"
                placeholder="نام شما"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">ایمیل</label>
              <input
                type="email"
                className="w-full border p-2 rounded-md"
                placeholder="example@mail.com"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">پیام</label>
              <textarea
                rows="5"
                className="w-full border p-2 rounded-md"
                placeholder="متن پیام شما"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              ارسال پیام
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
