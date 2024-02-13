'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Noto_Sans_JP } from 'next/font/google';
import QRCode from '@/components/QRcode';

const NotoSansJP = Noto_Sans_JP({ subsets: ['latin'], variable: '--font-sans' });

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [error, setError] = useState({
    title: '',
    hideTitle: '',
    deleteAfterDisplay: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    hideTitle: false,
    deleteAfterDisplay: false,
  });

  useEffect(() => {
    const qrCodeElement = document.getElementById('qrcode');
    if (qrCodeElement) {
      qrCodeElement.setAttribute('style', 'width: 100%');
    }
  }, [qrCodeUrl]);

  useEffect(() => {
    setLoading(true);

    const isFirstVisit = !document.cookie.includes('visited=true');
    if (isFirstVisit) {
      setShowDiv(true);
      document.cookie = 'visited=true; max-age=31536000'; // Set cookie to expire in 1 year
    }

    const timeout = setTimeout(() => {
      setShowDiv(false);
    }, 700);

    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value =
      (e.target as HTMLInputElement).type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });

    if (formData.title === '' && e.target.name === 'title') {
      setError({ title: 'タイトルを入力してください', hideTitle: '', deleteAfterDisplay: '' });
      console.log('Error: title is empty');
    } else {
      setError({ title: '', hideTitle: '', deleteAfterDisplay: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.title.length === 0) {
      setError({ title: 'タイトルを入力してください', hideTitle: '', deleteAfterDisplay: '' });
      console.log('error');
    } else {
      console.log(formData);

      try {
        const response = await fetch('/api/create', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const currentUrl = window.location.href;
        const responseBody = (await response.json()) as { id: string };
        const qrCodeUrl = `${currentUrl}${responseBody?.id ?? ''}`;
        setQrCodeUrl(qrCodeUrl);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  const handleClick = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsClicked(true);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-10">
      <div
        className={`absolute inset-0 z-50 h-screen w-screen items-center justify-center bg-white ${showDiv ? 'flex' : 'hidden'}`}
      >
        <Image
          src="/logo.svg"
          alt="kuchidomeseyo"
          width={1000}
          height={299}
          className={`${loading && 'animate-slide-out-fwd-center'} w-full max-w-lg`}
        />
      </div>
      {/* FORM */}
      <div
        className={`absolute left-1/2 top-1/2 h-screen w-screen max-w-lg -translate-x-1/2 -translate-y-1/2 ${NotoSansJP.className}`}
      >
        <div className="h-full w-full p-5 lg:p-10">
          <form
            className="relative flex h-full w-full max-w-lg flex-col overflow-hidden rounded-lg border-4 border-black bg-white pb-5"
            onSubmit={handleSubmit}
          >
            <h1 className="py-5 pb-10 text-center text-3xl font-bold">新規作成する</h1>
            <div className="flex h-full flex-col justify-between px-5">
              <div>
                <div>
                  <label htmlFor="title" className="block pb-2 text-lg font-semibold">
                    指示する内容
                  </label>
                  {error.title && <p className="pb-2 text-base font-medium text-red-500">{error.title}</p>}
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="w-full rounded-lg border-2 border-black p-2 focus-within:outline-none"
                  onChange={handleChange}
                />
                <div className="flex items-center pt-5">
                  <input
                    type="checkbox"
                    id="hideTitle"
                    name="hideTitle"
                    className="h-4 min-h-4 w-4 min-w-4 rounded-lg"
                    onChange={handleChange}
                  />
                  <label htmlFor="hideTitle" className="block pl-3 text-lg font-semibold">
                    ソーシャルメディア用の画像に内容を表示しない
                  </label>
                </div>
                <div className="flex items-center pt-5">
                  <input
                    type="checkbox"
                    id="deleteAfterDisplay"
                    name="deleteAfterDisplay"
                    className="h-4 min-h-4 w-4 min-w-4 rounded-lg"
                    onChange={handleChange}
                  />
                  <label htmlFor="deleteAfterDisplay" className="block pl-3 text-lg font-semibold">
                    閲覧後に消滅させる
                  </label>
                </div>
              </div>
              <div className="flex h-fit flex-col space-y-5">
                {qrCodeUrl && (
                  <span className="flex w-full justify-center text-center text-lg font-semibold">
                    {isClicked ? 'コピーしました' : 'QRコードをクリックしてURLをコピー'}
                  </span>
                )}
                <div className="px-10 pb-10">
                  {qrCodeUrl ? (
                    <QRCode
                      id="qrcode"
                      url={qrCodeUrl}
                      className="aspect-square cursor-pointer rounded-lg border-4 border-black p-10"
                      style={{
                        width: '100% !important',
                        height: '100% !important',
                      }}
                      onClick={() => handleClick(qrCodeUrl)}
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center rounded-lg border-4 border-black p-10">
                      <p className="text-center text-lg font-semibold">QRコードが表示されます</p>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="h-11 w-full rounded-lg bg-black p-2 text-white focus-within:outline-none"
                >
                  作成
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
