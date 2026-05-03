'use client';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#e6e6e6] text-gray-800 py-10 md:py-12">
      {/* ベース文字サイズを小さめ → 画面が広がるほど少し大きく */}
      <div className="container mx-auto px-4 text-xs sm:text-[13px] md:text-sm lg:text-base">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ロゴ＆プロフィール */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-3">
            <a href="#top" className="flex items-center">
                <Image
                  src="/natomi.png"
                  alt="natomi logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 md:h-8 md:w-8 cursor-pointer hover:opacity-80 transition"
                />
                <h2 className="text-lg md:text-xl font-bold text-[#3be7ed] ms-2"></h2>
              </a>
            </div>
            <p className="text-[#696969] mb-4 leading-relaxed">
              最近は生成AIをつかいながら日々開発を楽しんでいます。<br />
              インタビューライターで培ったコミュニケーション力でお手伝いします。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com/iIongPI6cAUuAWu"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-[#3be7ed] transition-colors"
                aria-label="X (Twitter)"
              >
                <i className="ri-twitter-line text-lg md:text-xl" />
              </a>

              <a
                href="https://note.com/natsugoro___"
                target="_blank"
                rel="noreferrer"
                aria-label="note"
                className="group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-5 h-6 md:w-6 md:h-7 fill-gray-400 group-hover:fill-[#3be7ed] transition-colors"
                >
                  <path d="m139.57,142.06c41.19,0,97.6-2.09,138.1-1.04,54.34,1.39,74.76,25.06,75.45,83.53.69,33.06,0,127.73,0,127.73h-58.79c0-82.83.35-96.5,0-122.6-.69-22.97-7.25-33.92-24.9-36.01-18.69-2.09-71.07-.35-71.07-.35v158.96h-58.79v-210.22Z" />
                </svg>
              </a>

              <a
                href="https://github.com/na0213"
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-[#3be7ed] transition-colors"
                aria-label="GitHub"
              >
                <i className="ri-github-line text-lg md:text-xl" />
              </a>
            </div>
          </div>

          {/* メニュー */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Menu</h3>
            <ul className="space-y-2">
              <li><a href="#about"  className="text-[#696969] hover:text-[#3be7ed] transition-colors">About</a></li>
              <li><a href="#skills" className="text-[#696969] hover:text-[#3be7ed] transition-colors">Skills</a></li>
              <li><a href="#works"  className="text-[#696969] hover:text-[#3be7ed] transition-colors">Works</a></li>
              <li><a href="#contact"className="text-[#696969] hover:text-[#3be7ed] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* 連絡先 */}
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Contact Info</h3>
            <div className="space-y-2 text-[#696969]">
              <div className="flex items-center">
                <i className="ri-mail-line mr-2" />
                <span>natomi.work@gmail.com</span>
              </div>
              <div className="flex items-center">
                <i className="ri-map-pin-line mr-2" />
                <span>Japan</span>
              </div>
            </div>
          </div>
        </div>

        {/* 区切り線＋コピーライト（中央配置） */}
        <div className="border-t border-gray-300 mt-8 pt-6">
          <div className="w-full text-center">
            <p className="text-gray-500 text-[11px] sm:text-xs md:text-sm">
              © {currentYear} natomi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
