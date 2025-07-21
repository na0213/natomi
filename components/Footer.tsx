'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#e6fafa] text-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* ロゴとプロフィール */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img 
                src="https://static.readdy.ai/image/a12a4ed85e332a39d4b890d8738d2418/653a65db2e6f34c0a4c63d826bf69bb0.png" 
                alt="natomi logo" 
                className="h-8 w-8 mr-2"
              />
              <h2 className="text-2xl font-bold text-[#3be7ed]">natomi</h2>
            </div>
            <p className="text-gray-300 mb-4">
              生物学の知識を活かしたライティングと、<br />
              ラグビー協会での経験を通じて培った<br />
              コミュニケーション力でお手伝いします。
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#3be7ed] transition-colors">
                <i className="ri-twitter-line text-xl"></i>
              </a>
              <a href="https://note.com/あなたのユーザー名" className="group">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-6 h-7 fill-gray-400 group-hover:fill-[#3be7ed] transition-colors"
                >
                  <path d="m139.57,142.06c41.19,0,97.6-2.09,138.1-1.04,54.34,1.39,74.76,25.06,75.45,83.53.69,33.06,0,127.73,0,127.73h-58.79c0-82.83.35-96.5,0-122.6-.69-22.97-7.25-33.92-24.9-36.01-18.69-2.09-71.07-.35-71.07-.35v158.96h-58.79v-210.22Z" />
                </svg>
              </a>

              <a href="#" className="text-gray-400 hover:text-[#3be7ed] transition-colors">
                <i className="ri-github-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-[#3be7ed] transition-colors">
                <i className="ri-mail-line text-xl"></i>
              </a>
            </div>
          </div>

          {/* ナビゲーション */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu</h3>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-300 hover:text-[#3be7ed] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#skills" className="text-gray-300 hover:text-[#3be7ed] transition-colors">
                  Skills
                </a>
              </li>
              <li>
                <a href="#works" className="text-gray-300 hover:text-[#3be7ed] transition-colors">
                  Works
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-[#3be7ed] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* 連絡先情報 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <i className="ri-mail-line mr-2"></i>
                <span>contact@natomi.com</span>
              </div>
              <div className="flex items-center">
                <i className="ri-phone-line mr-2"></i>
                <span>090-1234-5678</span>
              </div>
              <div className="flex items-center">
                <i className="ri-map-pin-line mr-2"></i>
                <span>Tokyo, Japan</span>
              </div>
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} natomi. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-[#3be7ed] text-sm transition-colors">
                プライバシーポリシー
              </a>
              <a href="#" className="text-gray-400 hover:text-[#3be7ed] text-sm transition-colors">
                利用規約
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}