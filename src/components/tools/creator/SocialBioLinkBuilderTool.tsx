import React, { useState } from 'react';
import { Copy, Check, Download, Link, Smartphone, Globe, Instagram, Youtube, Linkedin, Github, Mail } from 'lucide-react';

export const SocialBioLinkBuilderTool: React.FC<{ onShowToast: (msg: string) => void }> = ({ onShowToast }) => {
  const [name, setName] = useState('Alex Morgan');
  const [bio, setBio] = useState('Digital Creator & Full Stack Developer building browser apps.');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [website, setWebsite] = useState('https://splitdrop.com');
  const [instagram, setInstagram] = useState('alex.creates');
  const [youtube, setYoutube] = useState('@alexmorgandev');
  const [linkedin, setLinkedin] = useState('alex-morgan-dev');
  const [github, setGithub] = useState('alexmorgan');
  const [email, setEmail] = useState('alex@example.com');

  const generateStaticHtml = (): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - Bio Links</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }
    .card {
      background: rgba(255, 255, 255, 0.07);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 24px;
      width: 100%;
      max-width: 420px;
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      margin: 0 auto 16px;
      background: linear-gradient(135deg, #6366f1, #a855f7);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: bold;
      color: #ffffff;
      border: 3px solid rgba(255,255,255,0.3);
      object-fit: cover;
    }
    h1 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
    p.bio { font-size: 13px; color: #cbd5e1; margin-bottom: 24px; line-height: 1.5; }
    .links { display: flex; flex-direction: column; gap: 12px; }
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 20px;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      color: #ffffff;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      transition: all 0.2s ease;
    }
    .btn:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateY(-2px);
    }
    footer { margin-top: 28px; font-size: 11px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">
    ${
      avatarUrl
        ? `<img class="avatar" src="${avatarUrl}" alt="${name}" />`
        : `<div class="avatar">${name.charAt(0) || 'A'}</div>`
    }
    <h1>${name}</h1>
    <p class="bio">${bio}</p>

    <div class="links">
      ${website ? `<a class="btn" href="${website}" target="_blank">🌐 Official Website</a>` : ''}
      ${instagram ? `<a class="btn" href="https://instagram.com/${instagram}" target="_blank">📸 Instagram (@${instagram})</a>` : ''}
      ${youtube ? `<a class="btn" href="https://youtube.com/${youtube}" target="_blank">🎥 YouTube Channel</a>` : ''}
      ${linkedin ? `<a class="btn" href="https://linkedin.com/in/${linkedin}" target="_blank">💼 LinkedIn Profile</a>` : ''}
      ${github ? `<a class="btn" href="https://github.com/${github}" target="_blank">💻 GitHub Repositories</a>` : ''}
      ${email ? `<a class="btn" href="mailto:${email}">✉️ Contact via Email</a>` : ''}
    </div>

    <footer>Created with SplitDrop Bio Link Builder</footer>
  </div>
</body>
</html>`;
  };

  const handleDownloadHtml = () => {
    const htmlContent = generateStaticHtml();
    const element = document.createElement('a');
    const file = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${name.toLowerCase().replace(/\s+/g, '_')}_biolink.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    onShowToast('Downloaded Bio Link Website (HTML)!');
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Link className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Social Bio Link Builder
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build a single-page personal bio link website with live mobile preview and export standalone clean static HTML.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Controls */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Profile & Social Information
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bio / Headline</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Avatar Image URL (Optional)</label>
              <input
                type="text"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" /> Website
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram Handle
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Youtube className="w-3.5 h-3.5 text-rose-500" /> YouTube Handle
                </label>
                <input
                  type="text"
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-sky-500" /> LinkedIn Handle
                </label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-slate-800 dark:text-slate-200" /> GitHub Username
                </label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email Address
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleDownloadHtml}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Static Bio Link Website (.HTML)</span>
            </button>
          </div>
        </div>

        {/* Live Mobile Mockup Preview */}
        <div className="space-y-2 flex flex-col items-center">
          <div className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Smartphone className="w-4 h-4" /> Live Phone Preview
          </div>

          <div className="w-full max-w-[340px] rounded-[36px] p-4 bg-slate-900 text-white border-4 border-slate-800 shadow-2xl space-y-4 text-center my-auto">
            <div className="w-16 h-16 rounded-full mx-auto bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-xl border-2 border-white/20 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.charAt(0) || 'A'
              )}
            </div>

            <div>
              <h3 className="text-base font-extrabold">{name}</h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug px-2">{bio}</p>
            </div>

            <div className="space-y-2 pt-2">
              {website && (
                <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 cursor-pointer">
                  🌐 Official Website
                </div>
              )}
              {instagram && (
                <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 cursor-pointer">
                  📸 Instagram (@{instagram})
                </div>
              )}
              {youtube && (
                <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 cursor-pointer">
                  🎥 YouTube Channel
                </div>
              )}
              {linkedin && (
                <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 cursor-pointer">
                  💼 LinkedIn Profile
                </div>
              )}
              {github && (
                <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 cursor-pointer">
                  💻 GitHub Repositories
                </div>
              )}
              {email && (
                <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 cursor-pointer">
                  ✉️ Contact Email
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
