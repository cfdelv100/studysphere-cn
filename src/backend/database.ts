import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const databasePath = resolve(process.env.DATABASE_PATH ?? "data/studysphere.sqlite");
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new DatabaseSync(databasePath);
db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    simplified TEXT NOT NULL UNIQUE,
    traditional TEXT NOT NULL,
    pinyin TEXT NOT NULL,
    english TEXT NOT NULL,
    category TEXT NOT NULL,
    hsk_level INTEGER
  );
  CREATE TABLE IF NOT EXISTS word_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS group_words (
    group_id INTEGER NOT NULL REFERENCES word_groups(id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    PRIMARY KEY (group_id, word_id)
  );
  CREATE TABLE IF NOT EXISTS word_stats (
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    correct INTEGER NOT NULL DEFAULT 0,
    incorrect INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, word_id)
  );
  CREATE TABLE IF NOT EXISTS study_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_id TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    group_id INTEGER REFERENCES word_groups(id) ON DELETE SET NULL,
    started_at TEXT NOT NULL,
    ended_at TEXT,
    words_reviewed INTEGER NOT NULL DEFAULT 0,
    correct INTEGER NOT NULL DEFAULT 0,
    incorrect INTEGER NOT NULL DEFAULT 0
  );
  CREATE INDEX IF NOT EXISTS idx_sessions_user_started ON study_sessions(user_id, started_at DESC);
  CREATE INDEX IF NOT EXISTS idx_words_category ON words(category);
`);

interface SeedWord {
  simplified: string;
  traditional?: string;
  pinyin: string;
  english: string;
  category: string;
  hsk?: number;
}

const seedWords: SeedWord[] = [
  { simplified: "你好", pinyin: "nǐ hǎo", english: "hello; hi", category: "core", hsk: 1 },
  { simplified: "再见", pinyin: "zài jiàn", english: "goodbye", category: "core", hsk: 1 },
  { simplified: "谢谢", pinyin: "xiè xie", english: "thank you", category: "core", hsk: 1 },
  { simplified: "请", pinyin: "qǐng", english: "please; to invite", category: "core", hsk: 1 },
  { simplified: "对不起", pinyin: "duì bu qǐ", english: "sorry; excuse me", category: "core", hsk: 1 },
  { simplified: "是", pinyin: "shì", english: "to be; yes", category: "core", hsk: 1 },
  { simplified: "不", pinyin: "bù", english: "not; no", category: "core", hsk: 1 },
  { simplified: "有", pinyin: "yǒu", english: "to have; there is", category: "core", hsk: 1 },
  { simplified: "我", pinyin: "wǒ", english: "I; me", category: "core", hsk: 1 },
  { simplified: "你", pinyin: "nǐ", english: "you", category: "core", hsk: 1 },
  { simplified: "他", pinyin: "tā", english: "he; him", category: "core", hsk: 1 },
  { simplified: "她", pinyin: "tā", english: "she; her", category: "core", hsk: 1 },
  { simplified: "好", pinyin: "hǎo", english: "good; well", category: "core", hsk: 1 },
  { simplified: "学习", traditional: "學習", pinyin: "xué xí", english: "to study; to learn", category: "core", hsk: 1 },
  { simplified: "中文", traditional: "中文", pinyin: "zhōng wén", english: "Chinese language", category: "core", hsk: 1 },
  { simplified: "朋友", traditional: "朋友", pinyin: "péng you", english: "friend", category: "core", hsk: 1 },
  { simplified: "今天", traditional: "今天", pinyin: "jīn tiān", english: "today", category: "core", hsk: 1 },
  { simplified: "明天", traditional: "明天", pinyin: "míng tiān", english: "tomorrow", category: "core", hsk: 1 },
  { simplified: "喜欢", traditional: "喜歡", pinyin: "xǐ huan", english: "to like", category: "core", hsk: 1 },
  { simplified: "家", pinyin: "jiā", english: "home; family", category: "family", hsk: 1 },
  { simplified: "爸爸", traditional: "爸爸", pinyin: "bà ba", english: "father; dad", category: "family", hsk: 1 },
  { simplified: "妈妈", traditional: "媽媽", pinyin: "mā ma", english: "mother; mom", category: "family", hsk: 1 },
  { simplified: "哥哥", traditional: "哥哥", pinyin: "gē ge", english: "older brother", category: "family", hsk: 1 },
  { simplified: "姐姐", traditional: "姐姐", pinyin: "jiě jie", english: "older sister", category: "family", hsk: 1 },
  { simplified: "弟弟", traditional: "弟弟", pinyin: "dì di", english: "younger brother", category: "family", hsk: 1 },
  { simplified: "妹妹", traditional: "妹妹", pinyin: "mèi mei", english: "younger sister", category: "family", hsk: 1 },
  { simplified: "孩子", traditional: "孩子", pinyin: "hái zi", english: "child", category: "family", hsk: 1 },
  { simplified: "丈夫", traditional: "丈夫", pinyin: "zhàng fu", english: "husband", category: "family", hsk: 2 },
  { simplified: "妻子", traditional: "妻子", pinyin: "qī zi", english: "wife", category: "family", hsk: 2 },
  { simplified: "饭", traditional: "飯", pinyin: "fàn", english: "cooked rice; meal", category: "food", hsk: 1 },
  { simplified: "米饭", traditional: "米飯", pinyin: "mǐ fàn", english: "cooked rice", category: "food", hsk: 1 },
  { simplified: "面条", traditional: "麵條", pinyin: "miàn tiáo", english: "noodles", category: "food", hsk: 1 },
  { simplified: "饺子", traditional: "餃子", pinyin: "jiǎo zi", english: "dumplings", category: "food", hsk: 2 },
  { simplified: "包子", traditional: "包子", pinyin: "bāo zi", english: "steamed bun", category: "food", hsk: 2 },
  { simplified: "鸡肉", traditional: "雞肉", pinyin: "jī ròu", english: "chicken", category: "food", hsk: 2 },
  { simplified: "牛肉", traditional: "牛肉", pinyin: "niú ròu", english: "beef", category: "food", hsk: 2 },
  { simplified: "猪肉", traditional: "豬肉", pinyin: "zhū ròu", english: "pork", category: "food", hsk: 2 },
  { simplified: "鱼", traditional: "魚", pinyin: "yú", english: "fish", category: "food", hsk: 1 },
  { simplified: "蔬菜", traditional: "蔬菜", pinyin: "shū cài", english: "vegetables", category: "food", hsk: 2 },
  { simplified: "水果", traditional: "水果", pinyin: "shuǐ guǒ", english: "fruit", category: "food", hsk: 1 },
  { simplified: "苹果", traditional: "蘋果", pinyin: "píng guǒ", english: "apple", category: "food", hsk: 1 },
  { simplified: "香蕉", traditional: "香蕉", pinyin: "xiāng jiāo", english: "banana", category: "food", hsk: 2 },
  { simplified: "茶", traditional: "茶", pinyin: "chá", english: "tea", category: "food", hsk: 1 },
  { simplified: "水", traditional: "水", pinyin: "shuǐ", english: "water", category: "food", hsk: 1 },
  { simplified: "咖啡", traditional: "咖啡", pinyin: "kā fēi", english: "coffee", category: "food", hsk: 2 },
  { simplified: "牛奶", traditional: "牛奶", pinyin: "niú nǎi", english: "milk", category: "food", hsk: 1 },
  { simplified: "菜单", traditional: "菜單", pinyin: "cài dān", english: "menu", category: "food", hsk: 2 },
  { simplified: "餐厅", traditional: "餐廳", pinyin: "cān tīng", english: "restaurant", category: "food", hsk: 2 },
  { simplified: "早餐", traditional: "早餐", pinyin: "zǎo cān", english: "breakfast", category: "food", hsk: 2 },
  { simplified: "午饭", traditional: "午飯", pinyin: "wǔ fàn", english: "lunch", category: "food", hsk: 1 },
  { simplified: "晚饭", traditional: "晚飯", pinyin: "wǎn fàn", english: "dinner", category: "food", hsk: 1 },
  { simplified: "好吃", traditional: "好吃", pinyin: "hǎo chī", english: "delicious", category: "food", hsk: 2 },
  { simplified: "点菜", traditional: "點菜", pinyin: "diǎn cài", english: "to order food", category: "food", hsk: 3 },
  { simplified: "买单", traditional: "買單", pinyin: "mǎi dān", english: "to pay the bill", category: "food", hsk: 3 },
  { simplified: "筷子", traditional: "筷子", pinyin: "kuài zi", english: "chopsticks", category: "food", hsk: 2 },
  { simplified: "辣", traditional: "辣", pinyin: "là", english: "spicy", category: "food", hsk: 2 },
  { simplified: "甜", traditional: "甜", pinyin: "tián", english: "sweet", category: "food", hsk: 2 },
  { simplified: "盐", traditional: "鹽", pinyin: "yán", english: "salt", category: "food", hsk: 3 },
  { simplified: "糖", traditional: "糖", pinyin: "táng", english: "sugar", category: "food", hsk: 3 },
  { simplified: "厨房", traditional: "廚房", pinyin: "chú fáng", english: "kitchen", category: "food", hsk: 2 },
  { simplified: "机场", traditional: "機場", pinyin: "jī chǎng", english: "airport", category: "travel", hsk: 2 },
  { simplified: "酒店", traditional: "酒店", pinyin: "jiǔ diàn", english: "hotel", category: "travel", hsk: 2 },
  { simplified: "火车", traditional: "火車", pinyin: "huǒ chē", english: "train", category: "travel", hsk: 1 },
  { simplified: "出租车", traditional: "出租車", pinyin: "chū zū chē", english: "taxi", category: "travel", hsk: 2 },
  { simplified: "地铁", traditional: "地鐵", pinyin: "dì tiě", english: "subway", category: "travel", hsk: 2 },
  { simplified: "车站", traditional: "車站", pinyin: "chē zhàn", english: "station", category: "travel", hsk: 2 },
  { simplified: "地图", traditional: "地圖", pinyin: "dì tú", english: "map", category: "travel", hsk: 2 },
  { simplified: "左边", traditional: "左邊", pinyin: "zuǒ bian", english: "left side", category: "travel", hsk: 2 },
  { simplified: "右边", traditional: "右邊", pinyin: "yòu bian", english: "right side", category: "travel", hsk: 2 },
  { simplified: "这里", traditional: "這裡", pinyin: "zhè lǐ", english: "here", category: "travel", hsk: 1 },
  { simplified: "那里", traditional: "那裡", pinyin: "nà lǐ", english: "there", category: "travel", hsk: 1 },
  { simplified: "多少钱", traditional: "多少錢", pinyin: "duō shao qián", english: "how much money", category: "travel", hsk: 1 },
  { simplified: "护照", traditional: "護照", pinyin: "hù zhào", english: "passport", category: "travel", hsk: 3 },
  { simplified: "票", traditional: "票", pinyin: "piào", english: "ticket", category: "travel", hsk: 2 },
  { simplified: "行李", traditional: "行李", pinyin: "xíng li", english: "luggage", category: "travel", hsk: 3 },
  { simplified: "公园", traditional: "公園", pinyin: "gōng yuán", english: "park", category: "travel", hsk: 2 },
];

const seedGroups = [
  { name: "Core Vocabulary", description: "Essential words for everyday Mandarin", category: "core" },
  { name: "Food & Dining", description: "Mandarin words for ingredients, meals, ordering, and dining out", category: "food" },
  { name: "Travel Phrases", description: "Useful Mandarin vocabulary for getting around and traveling", category: "travel" },
  { name: "Family & Relationships", description: "Words for family members and relationships", category: "family" },
];

const addWord = db.prepare("INSERT OR IGNORE INTO words (simplified, traditional, pinyin, english, category, hsk_level) VALUES (?, ?, ?, ?, ?, ?)");
const addGroup = db.prepare("INSERT OR IGNORE INTO word_groups (name, description, category) VALUES (?, ?, ?)");
const addGroupWord = db.prepare("INSERT OR IGNORE INTO group_words (group_id, word_id) VALUES (?, ?)");
db.exec("BEGIN");
try {
  for (const word of seedWords) {
    addWord.run(word.simplified, word.traditional ?? word.simplified, word.pinyin, word.english, word.category, word.hsk ?? null);
  }
  for (const group of seedGroups) {
    addGroup.run(group.name, group.description, group.category);
    const groupId = Number((db.prepare("SELECT id FROM word_groups WHERE name = ?").get(group.name) as { id: number }).id);
    const words = db.prepare("SELECT id FROM words WHERE category = ?").all(group.category) as Array<{ id: number }>;
    for (const word of words) addGroupWord.run(groupId, word.id);
  }
  db.exec("COMMIT");
} catch (error) {
  db.exec("ROLLBACK");
  throw error;
}
