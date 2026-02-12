
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { PalaceData, ChartData, Star } from './types';

const PALACE_ORDER = ['巳', '午', '未', '申', '辰', '', '', '酉', '卯', '', '', '戌', '寅', '丑', '子', '亥'];

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'male' | 'female' | 'synastry' | 'affinity' | 'timing'>('timing');
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);

  const maleData: ChartData = useMemo(() => ({
    basicInfo: { gender: '男', birthTime: '2003-11-20 13:13', lunarTime: '癸未年十月廿七日未时', baZi: '癸未 癸亥 丁酉 丁未', fiveElements: '土五局', shenZhu: '天相', mingZhu: '廉贞' },
    palaces: [
      { name: '子女宫', ganZhi: '乙丑', mainStars: [{ name: '太阳', brightness: '不' }, { name: '太阴', brightness: '庙', siHua: '生年科' }], assistStars: [{ name: '左辅', brightness: '庙' }, { name: '右弼', brightness: '庙' }, { name: '擎羊', brightness: '庙' }], minorStars: [{ name: '天寿' }], shenSha: [], daXian: '35-44', xiaoXian: '', liuNian: '' },
      { name: '夫妻宫', ganZhi: '甲寅', mainStars: [{ name: '贪狼', brightness: '平', siHua: '生年忌' }], assistStars: [], minorStars: [{ name: '天喜' }], shenSha: [], daXian: '25-34', xiaoXian: '', liuNian: '' },
      { name: '命宫', ganZhi: '丙辰', mainStars: [{ name: '紫微', brightness: '得', transformation: '权', direction: 'In' }, { name: '天相', brightness: '得' }], assistStars: [{ name: '火星', brightness: '陷' }, { name: '地空', brightness: '陷' }], minorStars: [{ name: '恩光' }], shenSha: [], daXian: '5-14', xiaoXian: '', liuNian: '' },
      { name: '财帛宫', ganZhi: '甲子', mainStars: [{ name: '武曲', brightness: '旺' }, { name: '天府', brightness: '庙' }], assistStars: [{ name: '禄存', brightness: '庙' }], minorStars: [], shenSha: [], daXian: '45-54', xiaoXian: '', liuNian: '' },
      { name: '疾厄宫', ganZhi: '癸亥', mainStars: [{ name: '天同', brightness: '庙', transformation: '权', direction: 'In' }], assistStars: [{ name: '文曲', brightness: '旺' }, { name: '陀罗', brightness: '陷' }], minorStars: [], shenSha: [], daXian: '55-64', xiaoXian: '', liuNian: '' },
      { name: '兄弟宫', ganZhi: '乙卯', mainStars: [{ name: '天机', brightness: '旺' }, { name: '巨门', brightness: '庙', siHua: '生年权' }], assistStars: [], minorStars: [], shenSha: [], daXian: '15-24', xiaoXian: '', liuNian: '' },
      { name: '父母宫', ganZhi: '丁巳', mainStars: [{ name: '天梁', brightness: '得' }], assistStars: [{ name: '天钺', brightness: '旺' }], minorStars: [], shenSha: [], daXian: '115-124', xiaoXian: '', liuNian: '' },
      { name: '福德宫', ganZhi: '戊午', mainStars: [{ name: '七杀', brightness: '旺' }], assistStars: [{ name: '地劫', brightness: '庙' }], minorStars: [], shenSha: [], daXian: '105-114', xiaoXian: '', liuNian: '' },
      { name: '田宅宫', ganZhi: '己未', mainStars: [], assistStars: [], minorStars: [], shenSha: [], daXian: '95-104', xiaoXian: '', liuNian: '' },
      { name: '官禄宫', ganZhi: '庚申', mainStars: [{ name: '廉贞', brightness: '庙' }], assistStars: [], minorStars: [], shenSha: [], daXian: '85-94', xiaoXian: '', liuNian: '' },
      { name: '交友宫', ganZhi: '辛酉', mainStars: [], assistStars: [], minorStars: [], shenSha: [], daXian: '75-84', xiaoXian: '', liuNian: '' },
      { name: '迁移宫', ganZhi: '壬戌', mainStars: [{ name: '破军', brightness: '旺', siHua: '生年禄' }], assistStars: [], minorStars: [], shenSha: [], daXian: '65-74', xiaoXian: '', liuNian: '' },
    ]
  }), []);

  const femaleData: ChartData = useMemo(() => ({
    basicInfo: { gender: '女', birthTime: '1998-05-16 卯时', lunarTime: '戊寅年五月十六日卯时', baZi: '戊寅 戊午 戊子 乙卯', fiveElements: '水二局', shenZhu: '天梁', mingZhu: '文曲' },
    palaces: [
      { name: '子女宫', ganZhi: '甲子', mainStars: [{ name: '天梁', brightness: '庙' }], assistStars: [], minorStars: [], shenSha: [], daXian: '32-41', xiaoXian: '', liuNian: '' },
      { name: '夫妻宫', ganZhi: '乙丑', mainStars: [{ name: '廉贞', brightness: '利' }, { name: '七杀', brightness: '庙' }], assistStars: [{ name: '天魁', brightness: '旺' }], minorStars: [{ name: '红鸾' }], shenSha: [], daXian: '22-31', xiaoXian: '', liuNian: '' },
      { name: '命宫', ganZhi: '乙卯', mainStars: [], assistStars: [], minorStars: [{ name: '天空' }], shenSha: [], daXian: '2-11', xiaoXian: '', liuNian: '' },
      { name: '财帛宫', ganZhi: '癸亥', mainStars: [{ name: '天相', brightness: '得' }], assistStars: [], minorStars: [], shenSha: [], daXian: '42-51', xiaoXian: '', liuNian: '' },
      { name: '疾厄宫', ganZhi: '壬戌', mainStars: [{ name: '巨门', brightness: '陷' }], assistStars: [], minorStars: [], shenSha: ['寡宿'], daXian: '52-61', xiaoXian: '', liuNian: '' },
      { name: '迁移宫', ganZhi: '辛酉', mainStars: [{ name: '紫微', brightness: '旺' }, { name: '贪狼', brightness: '利', siHua: '生年禄' }], assistStars: [], minorStars: [], shenSha: [], daXian: '62-71', xiaoXian: '', liuNian: '' },
      { name: '田宅宫', ganZhi: '戊午', mainStars: [{ name: '太阳', brightness: '旺' }], assistStars: [{ name: '右弼', brightness: '旺', siHua: '生年科' }], minorStars: [], shenSha: [], daXian: '92-101', xiaoXian: '', liuNian: '' },
      { name: '官禄宫', ganZhi: '己未', mainStars: [{ name: '天府', brightness: '庙' }], assistStars: [{ name: '文昌', brightness: '利' }, { name: '文曲', brightness: '旺' }], minorStars: [], shenSha: [], daXian: '82-91', xiaoXian: '', liuNian: '' },
      { name: '交友宫', ganZhi: '庚申', mainStars: [{ name: '天机', brightness: '得', siHua: '生年忌' }, { name: '太阴', brightness: '利', siHua: '生年权' }], assistStars: [], minorStars: [], shenSha: [], daXian: '72-81', xiaoXian: '', liuNian: '' },
      { name: '兄弟宫', ganZhi: '甲寅', mainStars: [], assistStars: [{ name: '地劫', brightness: '平' }], minorStars: [], shenSha: [], daXian: '12-21', xiaoXian: '', liuNian: '' },
      { name: '福德宫', ganZhi: '丁巳', mainStars: [{ name: '武曲', brightness: '平' }, { name: '破军', brightness: '平' }], assistStars: [{ name: '禄存', brightness: '庙' }], minorStars: [], shenSha: [], daXian: '102-111', xiaoXian: '', liuNian: '' },
      { name: '父母宫', ganZhi: '丙辰', mainStars: [{ name: '天同', brightness: '平' }], assistStars: [{ name: '陀罗', brightness: '庙' }], minorStars: [], shenSha: [], daXian: '112-121', xiaoXian: '', liuNian: '' },
    ]
  }), []);

  const runAnalysis = async () => {
    setAnalysis("");
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let prompt = "";

      if (viewMode === 'timing') {
        prompt = `你现在是资深八字与紫微斗数合婚专家。针对以下两人的命理局，请详细解答用户的问题：“是否都是晚婚，八字相合会不会破这个晚婚”。

【命格数据】
男命：癸未年、癸亥月、丁酉日、丁未时
女命：戊寅年、戊午月、戊子日、乙卯时

【深度解析要求】
1. 晚婚定数分析：
   - 男方：丁火生于亥月失令，月柱官杀混杂，身弱杀重。坐下酉金偏财入妻宫。这种“偏财坐位”且“官杀克身”的格局，是否容易在早年遭遇情感动荡，从而导致晚婚？
   - 女方：戊土生于午月得令。但日支夫妻宫“子”水被月令“午”火剧烈相冲（子午冲），且正官乙木晚现于时柱。这种“夫宫受冲”且“官星晚到”的格局，是否是典型的晚婚定数？
2. 破解之道分析：
   - 重点考察两人的“合”：男方的亥（月）与女方的寅（年）呈【寅亥六合】；男方的未（年/时）与女方的午（月）呈【午未六合】。
   - 这种跨柱的强烈六合，是否能起到“填实”或“解冲”的作用，从而“破”掉各自命局中的婚姻波折与延迟，促使姻缘提前到来？
3. 结论与建议：
   - 明确给出：两人在一起是否能打破“晚婚”的魔咒。
   - 给出成婚的最佳时机点（流年）。
   - 给出性格磨合的“药方”。`;
      } else if (viewMode === 'affinity') {
        prompt = `深度解析缘分来源。男（2003癸未）夫妻宫寅；女（1998戊寅）夫妻宫丑。考察化禄入夫妻宫的具体路径。`;
      } else if (viewMode === 'synastry') {
        prompt = `综合合婚分析。考察生年干、命宫干、生肖干的互飞关系。男癸未，女戊寅。`;
      } else {
        prompt = `详细分析${viewMode === 'male' ? '男方' : '女方'}的命盘。`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: { 
          temperature: 0.7, 
          thinkingConfig: { thinkingBudget: 4000 } 
        }
      });
      setAnalysis(response.text || "推演失败。");
    } catch (error) {
      setAnalysis("天机晦暗，推演受阻。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [viewMode]);

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-[#fdfaf5]">
      <header className="w-full max-w-6xl mb-8 text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold serif text-red-900 mb-4 tracking-tighter">紫微天机 · 姻缘定数</h1>
        <div className="flex flex-wrap justify-center gap-2 bg-red-50 p-2 rounded-2xl shadow-inner border border-red-100">
          <button onClick={() => setViewMode('synastry')} className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${viewMode === 'synastry' ? 'bg-red-800 text-white shadow-lg' : 'text-red-800 hover:bg-red-100'}`}>综合合婚</button>
          <button onClick={() => setViewMode('timing')} className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${viewMode === 'timing' ? 'bg-indigo-700 text-white shadow-lg scale-105' : 'text-indigo-800 hover:bg-indigo-50'}`}>晚婚破解</button>
          <button onClick={() => setViewMode('affinity')} className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${viewMode === 'affinity' ? 'bg-amber-600 text-white shadow-lg' : 'text-amber-800 hover:bg-amber-50'}`}>缘分来源</button>
          <button onClick={() => setViewMode('male')} className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${viewMode === 'male' ? 'bg-blue-800 text-white shadow-lg' : 'text-blue-800 hover:bg-blue-50'}`}>男盘详情</button>
          <button onClick={() => setViewMode('female')} className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all ${viewMode === 'female' ? 'bg-pink-800 text-white shadow-lg' : 'text-pink-800 hover:bg-pink-50'}`}>女盘详情</button>
        </div>
      </header>

      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col gap-6 animate-fade-in">
          {viewMode === 'timing' && (
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border-t-8 border-indigo-600 relative overflow-hidden transition-all">
               <div className="absolute -right-4 -top-4 text-indigo-50 opacity-10">
                 <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
               </div>
               <h3 className="text-indigo-900 font-bold text-xl mb-6 flex items-center gap-3">
                 时空律动 · 八字格局
               </h3>
               
               <div className="space-y-6">
                 <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-white rounded-full">男命 · 癸未</span>
                      <span className="text-xs text-blue-800 font-bold bg-blue-100/50 px-2 py-0.5 rounded">杀重身弱</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                       {[
                         { p: '癸未', l: '年' },
                         { p: '癸亥', l: '月' },
                         { p: '丁酉', l: '日' },
                         { p: '丁未', l: '时' }
                       ].map((item, i) => (
                         <div key={i} className="bg-white p-2 rounded-xl shadow-inner border border-blue-50">
                           <span className={`text-lg font-bold block ${i === 2 ? 'text-red-600 underline decoration-2' : 'text-gray-800'}`}>{item.p}</span>
                           <span className="text-[9px] text-gray-400 font-medium">{item.l}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="p-5 bg-pink-50/50 rounded-3xl border border-pink-100 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest px-2 py-0.5 bg-white rounded-full">女命 · 戊寅</span>
                      <span className="text-xs text-pink-800 font-bold bg-pink-100/50 px-2 py-0.5 rounded">夫宫受冲</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                       {[
                         { p: '戊寅', l: '年' },
                         { p: '戊午', l: '月' },
                         { p: '戊子', l: '日' },
                         { p: '乙卯', l: '时' }
                       ].map((item, i) => (
                         <div key={i} className="bg-white p-2 rounded-xl shadow-inner border border-pink-50">
                           <span className={`text-lg font-bold block ${i === 2 ? 'text-red-600 underline decoration-2' : 'text-gray-800'}`}>{item.p}</span>
                           <span className="text-[9px] text-gray-400 font-medium">{item.l}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 rounded-[2rem] text-white shadow-lg border border-indigo-700">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-indigo-200">关键“破局”枢纽</h4>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between bg-white/10 p-2 rounded-xl border border-white/10">
                          <span className="text-xs">亥(男月) + 寅(女年)</span>
                          <span className="text-sm font-bold text-amber-300">寅亥六合</span>
                       </div>
                       <div className="flex items-center justify-between bg-white/10 p-2 rounded-xl border border-white/10">
                          <span className="text-xs">未(男年) + 午(女月)</span>
                          <span className="text-sm font-bold text-amber-300">午未六合</span>
                       </div>
                    </div>
                    <p className="text-[10px] text-indigo-300 mt-4 leading-relaxed font-light italic">
                      ※ 这种强烈的天干地支合化，是打破个人命局中“晚婚”阻碍的核心力量。
                    </p>
                 </div>
               </div>
            </div>
          )}

          {viewMode !== 'timing' && (
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
               <h3 className="text-red-900 font-bold text-lg mb-6 flex items-center gap-2">
                 <span className="w-1 h-5 bg-red-600 rounded-full"></span> 推演模式说明
               </h3>
               <p className="text-sm text-gray-600 leading-loose">
                 当前分析焦点：<span className="font-bold text-red-700 underline decoration-red-200">
                   {viewMode === 'synastry' ? '三合飞星综合合婚' : viewMode === 'affinity' ? '宫干飞星缘分来源' : '个人紫微命盘解析'}
                 </span>
                 <br/><br/>
                 通过紫微斗数“飞宫四化”与八字“格局平衡”法，全面解析这段关系的深度因果。
               </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-gray-100 min-h-[900px] relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-red-600 to-amber-500"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-50 rounded-full blur-[100px] opacity-20 -mr-48 -mb-48"></div>

            <div className="absolute top-12 right-14 flex items-center gap-4 z-10">
               {loading && <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
               <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">{loading ? '正在洞察天机...' : '命理专家分析报告'}</span>
            </div>
            
            <div className="prose prose-indigo max-w-none relative z-0">
               {loading ? (
                 <div className="space-y-12 pt-24">
                    <div className="h-12 bg-gray-50 rounded-full w-2/5 animate-pulse"></div>
                    <div className="space-y-5">
                      <div className="h-5 bg-gray-50 rounded w-full animate-pulse"></div>
                      <div className="h-5 bg-gray-50 rounded w-11/12 animate-pulse"></div>
                      <div className="h-5 bg-gray-50 rounded w-10/12 animate-pulse"></div>
                    </div>
                    <div className="h-96 bg-gray-50 rounded-[4rem] animate-pulse shadow-inner"></div>
                 </div>
               ) : (
                 <div className="text-gray-800 leading-relaxed whitespace-pre-wrap font-sans text-base md:text-lg selection:bg-indigo-100">
                   {analysis.split('\n').map((line, i) => {
                     const trimmed = line.trim();
                     if (!trimmed) return <div key={i} className="h-8" />;
                     
                     if (line.startsWith('#')) {
                       return (
                         <h2 key={i} className="text-indigo-950 font-bold serif text-3xl md:text-4xl mt-14 mb-10 border-b-4 border-indigo-50 pb-6 flex items-center gap-5">
                           <span className="w-4 h-14 bg-indigo-600 rounded-full shadow-lg"></span>
                           {line.replace(/^#+ /, '')}
                         </h2>
                       );
                     }

                     if (line.match(/^\d+\./)) {
                        return <div key={i} className="mb-10 font-bold text-red-950 bg-red-50/50 p-10 rounded-[2.5rem] border-l-[10px] border-red-500 shadow-sm leading-tight text-xl">{trimmed}</div>;
                     }

                     return <p key={i} className="mb-8 text-justify leading-[2.2] opacity-95 pl-4 border-l-2 border-gray-50">{trimmed}</p>;
                   })}
                 </div>
               )}
            </div>
          </div>
          
          <div className="bg-gray-900 p-12 rounded-[4rem] shadow-2xl border border-gray-800 relative group overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <h4 className="font-bold text-amber-400 flex items-center gap-5 text-sm uppercase tracking-[0.4em] mb-6 relative z-10">
               <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                 <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
               </div>
               大师核心断语
             </h4>
             <p className="text-lg text-gray-300 leading-loose font-light italic relative z-10">
               “晚婚”本质上是命格在等待一种能量的对冲与平衡。你们两人虽然各自单盘都有明显的延迟信号（官星晚现、夫宫被冲），但地支中呈现的【双六合】是极佳的“破局”信号。
               <br/><br/>
               这种合化的力量能有效化解原局中的冲克与不安，让原本动荡的缘分变得稳固。**简而言之：两人在一起，确实能打破各自命理中的“晚婚”定数，让正缘提前开花。**
             </p>
          </div>
        </div>
      </main>
      
      <footer className="mt-24 mb-20 text-gray-400 text-[11px] tracking-[0.6em] uppercase font-black text-center opacity-30 select-none">
        &copy; 2024 紫微天机 · 姻缘溯源与破解系统
      </footer>
    </div>
  );
};

export default App;
