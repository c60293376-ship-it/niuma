export interface SignPoem {
  id: string;
  hexagram?: string;
  questionType?: string;
  tendency: string;
  scene?: string;
  poem: string;
  meaning: string;
}

/**
 * 签诗库（105 首）
 * 覆盖 13 种 questionType × 5 种倾向
 * 风格：古意外壳 + 牛马内核 + 半玄学 + 有一点好笑
 */
export const signPoems: SignPoem[] = [
  // ══════ communication｜消息沟通 ══════
  { id: "comm_push_01", questionType: "communication", tendency: "宜主动推进", scene: "人际", poem: "消息未必不能发，\n只是别在凌晨发疯；\n三句说清去睡觉，\n别把输入框当树洞。", meaning: "发消息可以，但要简短、清醒、不沉溺。" },
  { id: "comm_push_02", questionType: "communication", tendency: "宜主动推进", scene: "人际", poem: "话到嘴边别吞回，\n轻轻一点也成雷；\n主动不是掉身价，\n只怕废话堆成堆。", meaning: "主动沟通不等于放低姿态，关键是简洁有效。" },
  { id: "comm_slow_01", questionType: "communication", tendency: "宜缓中进", scene: "人际", poem: "雁行渐远，音信迟回；\n缓问有机，急催生悔。", meaning: "不是不能问，是别急着连环追问。" },
  { id: "comm_slow_02", questionType: "communication", tendency: "宜缓中进", scene: "人际", poem: "话不必一次说完，\n风不必一阵吹散；\n轻推半步即可，\n别把对方吓跑。", meaning: "一次说一点，给对方留反应空间。" },
  { id: "comm_wait_01", questionType: "communication", tendency: "宜守待机", scene: "人际", poem: "屏幕亮了又熄，\n心事翻了三回；\n今日不宜追问，\n先让情绪归位。", meaning: "今天不适合再发消息，先等一等。" },
  { id: "comm_change_01", questionType: "communication", tendency: "宜改方式", scene: "人际", poem: "长篇未必有用，\n短句反倒见功；\n换个口气开场，\n别把真心说重。", meaning: "换一个语气和长度，效果会不同。" },
  { id: "comm_stop_01", questionType: "communication", tendency: "宜止损", scene: "人际", poem: "再发一句不显深情，\n只显你还没睡醒；\n今日撤兵为上，\n明日再做人形。", meaning: "别再发了，先停下来。" },

  // ══════ relationship_dynamic｜感情关系 ══════
  { id: "rel_push_01", questionType: "relationship_dynamic", tendency: "宜主动推进", scene: "感情", poem: "春水已动，柳影微斜；\n若要问心，先递一句闲话。", meaning: "想拉近距离，从一句轻松的话开始。" },
  { id: "rel_push_02", questionType: "relationship_dynamic", tendency: "宜主动推进", scene: "感情", poem: "缘分不怕轻轻问，\n只怕两边都装冷；\n你若先开半扇门，\n风也知道往哪进。", meaning: "双方都端着不会有进展，先轻推一下。" },
  { id: "rel_slow_01", questionType: "relationship_dynamic", tendency: "宜缓中进", scene: "感情", poem: "桃枝未必无花，\n只是开得慢些；\n别急着问结果，\n先看对方动作。", meaning: "关系有进展但要慢慢来，别急着要答案。" },
  { id: "rel_slow_02", questionType: "relationship_dynamic", tendency: "宜缓中进", scene: "感情", poem: "心事藏在回声里，\n不宜一锤定音；\n先试一句轻话，\n胜过深夜长文。", meaning: "与其深夜写小作文，不如白天轻描淡写试探。" },
  { id: "rel_wait_01", questionType: "relationship_dynamic", tendency: "宜守待机", scene: "感情", poem: "缘分今日未满格，\n强刷也不出结果；\n先把自己调亮，\n别在暗处等火。", meaning: "今天不适合推进感情，先把自己照顾好。" },
  { id: "rel_change_01", questionType: "relationship_dynamic", tendency: "宜改方式", scene: "感情", poem: "不是无缘，是路太旧；\n不是无话，是问太重；\n换个轻松入口，\n或许风会转头。", meaning: "换一种互动方式，轻松一点反而有用。" },
  { id: "rel_stop_01", questionType: "relationship_dynamic", tendency: "宜止损", scene: "感情", poem: "空等不是深情，\n内耗不是修行；\n若人不往前来，\n你也别原地成冰。", meaning: "如果一直是你单方面付出，该收一收了。" },

  // ══════ playful_fortune｜桃花好运 ══════
  { id: "play_push_01", questionType: "playful_fortune", tendency: "宜主动推进", scene: "感情", poem: "桃花不是外卖单，\n躺着不会送门前；\n出门露个自然面，\n缘分才有加载圈。", meaning: "桃花需要主动露面，机会不会从天而降。" },
  { id: "play_push_02", questionType: "playful_fortune", tendency: "宜主动推进", scene: "随问", poem: "好运不是没上线，\n只是需要你出门；\n今日宜露个脸，\n别让命运找错人。", meaning: "出门走走，好运气需要你主动出击。" },
  { id: "play_slow_01", questionType: "playful_fortune", tendency: "宜缓中进", scene: "感情", poem: "桃花未必当场开，\n先有风声后有来；\n别把期待拉太满，\n自然一点更可爱。", meaning: "桃花有迹象但不要心急，自然最好。" },
  { id: "play_slow_02", questionType: "playful_fortune", tendency: "宜缓中进", scene: "随问", poem: "今日气运半加载，\n急点刷新也白来；\n慢走两步看风向，\n小喜多在转角开。", meaning: "好运气正在加载中，急不来。" },
  { id: "play_wait_01", questionType: "playful_fortune", tendency: "宜守待机", scene: "随问", poem: "好运今日不喧哗，\n像个潜水的瓜；\n别硬求天降彩蛋，\n先把状态养大。", meaning: "今天不适合高期待，先调整好自己的状态。" },
  { id: "play_change_01", questionType: "playful_fortune", tendency: "宜改方式", scene: "随问", poem: "不是运气不来，\n是你蹲错站台；\n换个地方出现，\n风才知道你在。", meaning: "换个环境、换个方式，运气可能会不一样。" },
  { id: "play_stop_01", questionType: "playful_fortune", tendency: "宜止损", scene: "随问", poem: "今日别赌玄学，\n也别猛刷奇迹；\n把期待收一收，\n免得心态先破局。", meaning: "今天不适合期待好运降临，平常心度过。" },

  // ══════ wealth_luck｜财运搞钱 ══════
  { id: "wealth_push_01", questionType: "wealth_luck", tendency: "宜主动推进", scene: "选择", poem: "财气今日有微风，\n动手才见小回声；\n别等天降金元宝，\n先把正事往前拱。", meaning: "财运偏动，主动处理正事比空想进财靠谱。" },
  { id: "wealth_push_02", questionType: "wealth_luck", tendency: "宜主动推进", scene: "工作", poem: "钱路不在梦里开，\n账本先从手中来；\n该问该谈别含糊，\n机会常在嘴边摆。", meaning: "主动谈收入、理账本，财运要行动来激活。" },
  { id: "wealth_slow_01", questionType: "wealth_luck", tendency: "宜缓中进", scene: "选择", poem: "财来不宜猛扑，\n水满反易翻壶；\n先看成本几许，\n再谈收入几株。", meaning: "不要冲动投入，先算清楚成本。" },
  { id: "wealth_slow_02", questionType: "wealth_luck", tendency: "宜缓中进", scene: "工作", poem: "搞钱不是冲锋，\n也要算清西东；\n慢半拍看明白，\n胜过一头扎空。", meaning: "慢一点想清楚，比盲目冲更有后劲。" },
  { id: "wealth_wait_01", questionType: "wealth_luck", tendency: "宜守待机", scene: "选择", poem: "财气今日不算猛，\n先别幻想一夜红；\n守住钱包不乱点，\n已胜半个打工工。", meaning: "今天宜守财，不乱花钱就是赚。" },
  { id: "wealth_change_01", questionType: "wealth_luck", tendency: "宜改方式", scene: "工作", poem: "不是钱不近人，\n是路走得太沉；\n换个入口试水，\n别把旧坑当门。", meaning: "搞钱方式该换了，不要一条路走到黑。" },
  { id: "wealth_stop_01", questionType: "wealth_luck", tendency: "宜止损", scene: "选择", poem: "此财看着发光，\n细看全是包装；\n今日宜护钱包，\n别给冲动上香。", meaning: "警惕消费冲动和虚假理财诱惑。" },

  // ══════ work_opportunity｜offer 实习 岗位 ══════
  { id: "wopp_push_01", questionType: "work_opportunity", tendency: "宜主动推进", scene: "工作", poem: "机会已到门前，\n别只隔窗观天；\n问清薪粮边界，\n再把简历向前。", meaning: "机会来了就主动出击，但要问清细节。" },
  { id: "wopp_push_02", questionType: "work_opportunity", tendency: "宜主动推进", scene: "工作", poem: "此局可先上车，\n但别闭眼交车；\n岗位若有真长进，\n牛马也能修成鹅。", meaning: "可以接但要看清楚，有成长空间才值得。" },
  { id: "wopp_slow_01", questionType: "work_opportunity", tendency: "宜缓中进", scene: "工作", poem: "offer 看着很体面，\n也要问清坑几层；\n别把焦虑当缘分，\n合同之前先醒神。", meaning: "别因为焦虑就急着接，问清楚再签。" },
  { id: "wopp_slow_02", questionType: "work_opportunity", tendency: "宜缓中进", scene: "工作", poem: "门开不必立刻冲，\n先看屋里几盏灯；\n成长若明可进，\n消耗太重则停。", meaning: "看清楚是成长机会还是纯消耗再决定。" },
  { id: "wopp_wait_01", questionType: "work_opportunity", tendency: "宜守待机", scene: "工作", poem: "此约未必不好，\n只是条件未昭；\n等问清再点头，\n别被空窗吓跑。", meaning: "等等再决定，别因为怕空窗就乱答应。" },
  { id: "wopp_change_01", questionType: "work_opportunity", tendency: "宜改方式", scene: "工作", poem: "不是机会太少，\n是筛子还不够牢；\n换个标准再看，\n别把消耗当宝。", meaning: "换个筛选标准，不要只看到表面的机会。" },
  { id: "wopp_stop_01", questionType: "work_opportunity", tendency: "宜止损", scene: "工作", poem: "若只剩体面二字，\n不见成长半分；\n此门可缓一步，\n别拿青春抵薪。", meaning: "如果只有面子没有成长，不值得接。" },

  // ══════ workplace_dynamic｜老板同事职场 ══════
  { id: "workpl_push_01", questionType: "workplace_dynamic", tendency: "宜主动推进", scene: "工作", poem: "职场风向可试，\n不宜闷头装死；\n该汇报的汇报，\n别等锅来找你。", meaning: "主动汇报、主动沟通，不要被动等事。" },
  { id: "workpl_slow_01", questionType: "workplace_dynamic", tendency: "宜缓中进", scene: "工作", poem: "老板心似云层，\n莫急妄断阴晴；\n稳住交付节奏，\n少给脑补加薪。", meaning: "不要过度解读老板的态度，稳住表现最重要。" },
  { id: "workpl_wait_01", questionType: "workplace_dynamic", tendency: "宜守待机", scene: "工作", poem: "此时不宜抢话，\n先看风往哪刮；\n把事做得干净，\n胜过解释一大把。", meaning: "先做好手头的事，不要急着表态。" },
  { id: "workpl_change_01", questionType: "workplace_dynamic", tendency: "宜改方式", scene: "工作", poem: "不是你没做事，\n是别人没看见；\n换个汇报方式，\n功劳别藏太远。", meaning: "功劳需要展示，换个汇报策略。" },
  { id: "workpl_stop_01", questionType: "workplace_dynamic", tendency: "宜止损", scene: "工作", poem: "职场不是修仙，\n别把委屈炼丹；\n边界若被踩烂，\n先把自己保全。", meaning: "保护好职场边界，不要无限度忍耐。" },

  // ══════ study_school｜课程考试毕业 ══════
  { id: "study_push_01", questionType: "study_school", tendency: "宜主动推进", scene: "学业", poem: "书山不怕路陡，\n怕你开局就休；\n今日先翻三页，\n胜过许愿通宵。", meaning: "与其许愿通宵复习，不如今天就开始行动。" },
  { id: "study_push_02", questionType: "study_school", tendency: "宜主动推进", scene: "学业", poem: "导师未必难近，\n问题别攒成云；\n带着方案去问，\n比空手喊救命。", meaning: "找导师前先准备方案，不要空手求助。" },
  { id: "study_slow_01", questionType: "study_school", tendency: "宜缓中进", scene: "学业", poem: "功课不宜乱炖，\n先把重点捞稳；\n一章一章拆开，\n焦虑自然少滚。", meaning: "按章节有序复习，比焦虑乱翻有效。" },
  { id: "study_slow_02", questionType: "study_school", tendency: "宜缓中进", scene: "学业", poem: "毕业不是盲盒，\n节点都在册页；\n先查要求几条，\n再谈命运玄学。", meaning: "毕业进度有据可查，先确认要求。" },
  { id: "study_wait_01", questionType: "study_school", tendency: "宜守待机", scene: "学业", poem: "今日不宜乱冲，\n先把目录看懂；\n方向若未定下，\n努力容易跑空。", meaning: "先搞清楚方向再发力，避免无效努力。" },
  { id: "study_change_01", questionType: "study_school", tendency: "宜改方式", scene: "学业", poem: "不是你不聪明，\n是方法有点钝；\n换个笔记结构，\n分数才会转身。", meaning: "方法比聪明重要，换一种学习方式试试。" },
  { id: "study_stop_01", questionType: "study_school", tendency: "宜止损", scene: "学业", poem: "此题莫再死磕，\n脑袋快被磨破；\n先换一处下手，\n别在原地成佛。", meaning: "不要在低效的环节上继续耗时间。" },

  // ══════ course_absence｜缺课逃课影响 ══════
  { id: "abse_push_01", questionType: "course_absence", tendency: "宜主动推进", scene: "学业", poem: "此课不是不能缺，\n缺了记得补因果；\n笔记先向同窗借，\n别让平时分沉默。", meaning: "缺课后主动补救，借笔记、补任务。" },
  { id: "abse_slow_01", questionType: "course_absence", tendency: "宜缓中进", scene: "学业", poem: "点名声未必成雷，\n但别把侥幸当杯；\n先问任务有无，\n再谈缺席几回。", meaning: "先确认缺课影响多大，不要靠侥幸。" },
  { id: "abse_wait_01", questionType: "course_absence", tendency: "宜守待机", scene: "学业", poem: "此课风声未明，\n莫把懒意当灵；\n先探课堂虚实，\n再决定去或停。", meaning: "不要偷懒，先搞清楚情况再决定。" },
  { id: "abse_change_01", questionType: "course_absence", tendency: "宜改方式", scene: "学业", poem: "若身不能到场，\n心也别全离岗；\n换个补救姿势，\n别让记录发凉。", meaning: "即使不能去上课，也要想办法补救。" },
  { id: "abse_stop_01", questionType: "course_absence", tendency: "宜止损", scene: "学业", poem: "此课今日不宜赌，\n平时分在暗处哭；\n能去便去一趟，\n少给未来添堵。", meaning: "如果缺课会造成实质影响，还是去上课吧。" },

  // ══════ project_deadline｜项目 DDL demo ══════
  { id: "proj_push_01", questionType: "project_deadline", tendency: "宜主动推进", scene: "选择", poem: "大饼先别画太圆，\n能跑就是第一关；\n今晚不求封神作，\n先把 demo 保上岸。", meaning: "先做最小可展示版本，不要追求完美。" },
  { id: "proj_push_02", questionType: "project_deadline", tendency: "宜主动推进", scene: "工作", poem: "代码未必懂你苦，\n但会认你先动手；\n少想十个宇宙，\n先通一个入口。", meaning: "先跑通一个入口，别想太多。" },
  { id: "proj_slow_01", questionType: "project_deadline", tendency: "宜缓中进", scene: "选择", poem: "急火烧不出完整，\n先把主线跑成；\n旁枝今日先砍，\n明日再谈精致。", meaning: "先完成主流程，细节后面再补。" },
  { id: "proj_wait_01", questionType: "project_deadline", tendency: "宜守待机", scene: "选择", poem: "需求如云压顶，\n不宜样样都请；\n先分轻重缓急，\n别被完美索命。", meaning: "排优先级，不要全都想做。" },
  { id: "proj_change_01", questionType: "project_deadline", tendency: "宜改方式", scene: "选择", poem: "不是项目太难，\n是路线绕成环；\n换个最小闭环，\n先让页面能看。", meaning: "换个思路，先做最小闭环。" },
  { id: "proj_stop_01", questionType: "project_deadline", tendency: "宜止损", scene: "选择", poem: "此处不宜加戏，\n功能越堆越迷；\n砍掉三分枝叶，\n主干才能站起。", meaning: "砍掉不必要的功能，保住核心交付。" },

  // ══════ emotion_reset｜焦虑内耗摆烂 ══════
  { id: "emot_push_01", questionType: "emotion_reset", tendency: "宜主动推进", scene: "随问", poem: "心乱不是天塌，\n先做一件小事；\n动起来不治百病，\n但能少演十集。", meaning: "动起来，不要陷入内心小剧场。" },
  { id: "emot_slow_01", questionType: "emotion_reset", tendency: "宜缓中进", scene: "随问", poem: "情绪今日偏满，\n别急着下判官；\n先喝水再洗脸，\n人生暂不清算。", meaning: "情绪高的时候不要做重要决定。" },
  { id: "emot_wait_01", questionType: "emotion_reset", tendency: "宜守待机", scene: "随问", poem: "今日不宜硬刚，\n先把自己收仓；\n风没转向之前，\n别把心态赔光。", meaning: "今天不适合硬抗，先收一收情绪。" },
  { id: "emot_change_01", questionType: "emotion_reset", tendency: "宜改方式", scene: "随问", poem: "不是你太脆弱，\n是脑内太会播；\n换个环境坐坐，\n别让念头上桌。", meaning: "换个环境，打破反复纠结的念头。" },
  { id: "emot_stop_01", questionType: "emotion_reset", tendency: "宜止损", scene: "随问", poem: "内耗若已开席，\n你别继续买单；\n今日先退半步，\n明日再战人间。", meaning: "停止内耗，今天先放过自己。" },

  // ══════ weather_travel｜天气出行 ══════
  { id: "weath_push_01", questionType: "weather_travel", tendency: "宜主动推进", scene: "随问", poem: "云色未必拦路，\n行人自有归途；\n出门先看天意，\n伞也算半个护符。", meaning: "可以出门，但看一眼天气带把伞。" },
  { id: "weath_slow_01", questionType: "weather_travel", tendency: "宜缓中进", scene: "随问", poem: "天色半明半疑，\n行程不宜排密；\n带伞不是认怂，\n是给命运留余地。", meaning: "留弹性，备雨具，计划不要太紧。" },
  { id: "weath_wait_01", questionType: "weather_travel", tendency: "宜守待机", scene: "随问", poem: "风云今日不稳，\n路上多留一寸；\n能晚半刻再动，\n少被天气教育。", meaning: "天气不好时不如晚点出门。" },
  { id: "weath_change_01", questionType: "weather_travel", tendency: "宜改方式", scene: "随问", poem: "天公不按剧本，\n路线可以换门；\n户外若添变数，\n室内也能成春。", meaning: "户外不行就换室内安排。" },
  { id: "weath_stop_01", questionType: "weather_travel", tendency: "宜止损", scene: "随问", poem: "此行若全靠赌，\n多半要被雨堵；\n计划先收一收，\n别和乌云斗富。", meaning: "如果天气太差就别硬出门了。" },

  // ══════ choice_tradeoff｜选择取舍 ══════
  { id: "choi_push_01", questionType: "choice_tradeoff", tendency: "宜主动推进", scene: "选择", poem: "两路摆在眼前，\n别只原地转圈；\n先选能长一寸，\n再谈命运成全。", meaning: "选择有成长空间的那个方向。" },
  { id: "choi_slow_01", questionType: "choice_tradeoff", tendency: "宜缓中进", scene: "选择", poem: "选择不是抽签，\n也要算算明天；\n眼前若只求稳，\n日后或要还钱。", meaning: "不要只看眼前安全感，考虑长期代价。" },
  { id: "choi_wait_01", questionType: "choice_tradeoff", tendency: "宜守待机", scene: "选择", poem: "答案尚未浮出，\n别急把路封住；\n多问一个条件，\n少走三里弯路。", meaning: "信息不够时先不要急着选。" },
  { id: "choi_change_01", questionType: "choice_tradeoff", tendency: "宜改方式", scene: "选择", poem: "不是选项太差，\n是尺子有点歪；\n换个标准衡量，\n好坏自然分开。", meaning: "换个评估标准，选项的优劣会更清楚。" },
  { id: "choi_stop_01", questionType: "choice_tradeoff", tendency: "宜止损", scene: "选择", poem: "有些门看似亮，\n进去全是消耗；\n能停不是失败，\n是给未来留道。", meaning: "如果一个选项明显是消耗，果断放弃。" },

  // ══════ person_attitude｜他人态度 ══════
  { id: "pers_push_01", questionType: "person_attitude", tendency: "宜主动推进", scene: "人际", poem: "人心隔着云雾，\n但信号会露出；\n不必猛猜答案，\n先递一句稳妥。", meaning: "与其猜测不如轻量沟通一次。" },
  { id: "pers_slow_01", questionType: "person_attitude", tendency: "宜缓中进", scene: "人际", poem: "对方心事未明，\n你先稳住身形；\n少些脑内审判，\n多看实际回应。", meaning: "先观察对方行为，不要自己脑补。" },
  { id: "pers_wait_01", questionType: "person_attitude", tendency: "宜守待机", scene: "人际", poem: "此心不可硬读，\n此局不宜强扑；\n等他露一分意，\n胜你猜到天黑。", meaning: "等对方释放明确信号，不要自己硬猜。" },
  { id: "pers_change_01", questionType: "person_attitude", tendency: "宜改方式", scene: "人际", poem: "不是对方无情，\n是你问法太惊；\n换个自然时机，\n话才容易成形。", meaning: "换一个更自然的时机和方式沟通。" },
  { id: "pers_stop_01", questionType: "person_attitude", tendency: "宜止损", scene: "人际", poem: "若总靠猜维生，\n心会越猜越贫；\n收回一点注意，\n别把自己赔进。", meaning: "停止过度揣测，把注意力放回自己。" },

  // ══════ future_timing｜时间推进 ══════
  { id: "time_push_01", questionType: "future_timing", tendency: "宜主动推进", scene: "通用", poem: "时机不只等来，\n也靠一手推开；\n先把条件补齐，\n日子自然靠近。", meaning: "时间问题先看条件，主动补齐会更快推进。" },
  { id: "time_slow_01", questionType: "future_timing", tendency: "宜缓中进", scene: "通用", poem: "日子还在路上，\n火候不可硬烫；\n慢把条件养熟，\n答案自会发亮。", meaning: "时机未熟但可推进，重点是慢慢补条件。" },
  { id: "time_wait_01", questionType: "future_timing", tendency: "宜守待机", scene: "通用", poem: "钟声尚未落定，\n先别催问天明；\n守住眼前条件，\n风到自有回音。", meaning: "暂时不宜催结果，先等待条件到位。" },
  { id: "time_change_01", questionType: "future_timing", tendency: "宜改方式", scene: "通用", poem: "不是日期太远，\n是路径绕了弯；\n换个推进方法，\n时机才肯靠岸。", meaning: "如果一直等不到结果，需要换推进方式。" },
  { id: "time_stop_01", questionType: "future_timing", tendency: "宜止损", scene: "通用", poem: "若把明日硬拽，\n今日反被拖坏；\n暂收这份执念，\n另给自己安排。", meaning: "不要把全部希望押在具体时间上，先止住消耗。" },

  // ══════ action_decision / general｜通用 ══════
  { id: "gen_push_01", questionType: "action_decision", tendency: "宜主动推进", scene: "通用", poem: "风已经到门口，\n别再假装没听见；\n先走一步看看，\n路会自己长出来。", meaning: "时机到了，先行动起来。" },
  { id: "gen_push_02", questionType: "action_decision", tendency: "宜主动推进", scene: "通用", poem: "今日不宜空想，\n宜把念头落地；\n先动一寸试试，\n胜过脑中千里。", meaning: "行动比空想有用。" },
  { id: "gen_push_03", questionType: "action_decision", tendency: "宜主动推进", scene: "通用", poem: "东风吹散一川云，\n该动身时莫再等；\n机会从来不等人，\n多说一句就多一分。", meaning: "形势有利于主动出击。" },
  { id: "gen_slow_01", questionType: "action_decision", tendency: "宜缓中进", scene: "通用", poem: "急火煮不熟人生，\n慢一点反而不糊；\n该问的问清楚，\n该等的等半步。", meaning: "不要急，慢慢来反而更稳。" },
  { id: "gen_slow_02", questionType: "action_decision", tendency: "宜缓中进", scene: "通用", poem: "风来不必追风，\n水动不必下水；\n缓行不是退缩，\n是给自己留腿。", meaning: "稳住节奏，不要被外在变化推着走。" },
  { id: "gen_slow_03", questionType: "action_decision", tendency: "宜缓中进", scene: "通用", poem: "雁行渐远，音信迟回；\n缓问有机，急催生悔。", meaning: "不是不能做，是别带着焦虑做。" },
  { id: "gen_wait_01", questionType: "action_decision", tendency: "宜守待机", scene: "通用", poem: "今日不宜硬刚，\n先把情绪收仓；\n风没转向之前，\n别把自己赔光。", meaning: "今天不适合硬碰硬，先稳住。" },
  { id: "gen_wait_02", questionType: "action_decision", tendency: "宜守待机", scene: "通用", poem: "门未开时别撞，\n灯未亮时别闯；\n守住手中一线，\n也算今日有光。", meaning: "时机未到时守住当下就是胜利。" },
  { id: "gen_wait_03", questionType: "action_decision", tendency: "宜守待机", scene: "通用", poem: "古井无波月自沉，\n此时不动胜于动；\n守好眼前三两事，\n风向转时再扬帆。", meaning: "现在不是行动的好时机。" },
  { id: "gen_change_01", questionType: "action_decision", tendency: "宜改方式", scene: "通用", poem: "不是你不努力，\n是打法有点旧；\n换个入口试试，\n门不止这一扇。", meaning: "换个方法试试。" },
  { id: "gen_change_02", questionType: "action_decision", tendency: "宜改方式", scene: "通用", poem: "原路走得太久，\n鞋底都在喊累；\n换条小路看看，\n风景也许对味。", meaning: "不要一条路走到底，换一条试试。" },
  { id: "gen_change_03", questionType: "action_decision", tendency: "宜改方式", scene: "通用", poem: "一条路走不通就别硬走，\n换条小路也许更快；\n不是方向错，是方法旧，\n换个说法试试看。", meaning: "方向没错，方法需要调整。" },
  { id: "gen_stop_01", questionType: "action_decision", tendency: "宜止损", scene: "通用", poem: "这局别再硬撑，\n沉没成本别封神；\n能撤就先撤半步，\n命还要留着打工。", meaning: "及时止损，不要再为沉没成本买单。" },
  { id: "gen_stop_02", questionType: "action_decision", tendency: "宜止损", scene: "通用", poem: "若路越走越窄，\n别怪鞋不够乖；\n及时转身一步，\n也是天命安排。", meaning: "路走不通时果断转身。" },
  { id: "gen_stop_03", questionType: "action_decision", tendency: "宜止损", scene: "通用", poem: "握沙太紧沙自流，\n不如松手两清静；\n及时止损不是输，\n是把力气留给值得的事。", meaning: "继续耗下去不值得，放手是清醒。" },

  // ══════ 卦象专用 ══════
  { id: "hex_jian_01", hexagram: "风山渐", tendency: "宜缓中进", poem: "雁行渐远，音信迟回；\n缓问有机，急催生悔。", meaning: "渐卦主循序渐进，问沟通之事宜缓不宜急。" },
];
