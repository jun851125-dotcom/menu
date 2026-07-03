// English Vocabulary Database for Middle/High School levels
const VOCAB_DATABASE = {
  levels: [
    {
      id: 1,
      name: "問候與基礎單字",
      description: "問候與基礎單字 — 學習打招呼、感謝及基本回應",
      icon: "👋",
      vocab: [
        { word: "Hello", translation: "你好", category: "Greeting", hint: "Hello (通用問候)", emoji: "👋" },
        { word: "Good morning", translation: "早上好", category: "Greeting", hint: "Good morning", emoji: "☀️" },
        { word: "Good afternoon", translation: "下午好", category: "Greeting", hint: "Good afternoon", emoji: "🌤️" },
        { word: "Good night", translation: "晚安", category: "Greeting", hint: "Good night", emoji: "🌙" },
        { word: "Please", translation: "請", category: "Politeness", hint: "Please", emoji: "🙏" },
        { word: "Thank you", translation: "謝謝", category: "Politeness", hint: "Thank you", emoji: "😊" },
        { word: "How are you?", translation: "你好嗎？", category: "Greeting", hint: "How are you? / Is everything fine?", emoji: "❓" },
        { word: "Yes", translation: "是", category: "Basic", hint: "Yes", emoji: "👍" },
        { word: "No", translation: "不", category: "Basic", hint: "No", emoji: "👎" },
        { word: "Welcome", translation: "歡迎", category: "Greeting", hint: "Welcome", emoji: "🚪" }
      ],
      sentences: [
        { english: "Hello, how are you?", translation: "你好，你好嗎？" },
        { english: "Good morning, thank you!", translation: "早上好，謝謝！" },
        { english: "Yes, please.", translation: "是的，請。" }
      ]
    },
    {
      id: 2,
      name: "食物與飲料",
      description: "食物與飲料 — 學習常見的水果、點心與日常飲品",
      icon: "🍔",
      vocab: [
        { word: "water", translation: "水", category: "Drink", hint: "Water", emoji: "💧" },
        { word: "tea", translation: "茶", category: "Drink", hint: "Tea", emoji: "🍵" },
        { word: "coffee", translation: "咖啡", category: "Drink", hint: "Coffee", emoji: "☕" },
        { word: "bread", translation: "麵包", category: "Food", hint: "Bread", emoji: "🍞" },
        { word: "sandwich", translation: "三明治", category: "Food", hint: "Sandwich", emoji: "🥪" },
        { word: "apple", translation: "蘋果", category: "Food", hint: "Apple", emoji: "🍎" },
        { word: "milk", translation: "牛奶", category: "Drink", hint: "Milk", emoji: "🥛" },
        { word: "juice", translation: "果汁", category: "Drink", hint: "Juice", emoji: "🥤" },
        { word: "cheese", translation: "起司", category: "Food", hint: "Cheese", emoji: "🧀" },
        { word: "rice", translation: "米飯", category: "Food", hint: "Rice", emoji: "🍚" }
      ],
      sentences: [
        { english: "I want a sandwich.", translation: "我想要一個三明治。" },
        { english: "I drink water and coffee.", translation: "我喝水和咖啡。" },
        { english: "She eats bread with cheese.", translation: "她吃麵包配起司。" }
      ]
    },
    {
      id: 3,
      name: "學校與學習",
      description: "學校與學習 — 探索教室用品、科目與學習相關單字",
      icon: "🎒",
      vocab: [
        { word: "school", translation: "學校", category: "Location", hint: "School", emoji: "🏫" },
        { word: "book", translation: "書本", category: "Item", hint: "Book", emoji: "📖" },
        { word: "pen", translation: "原子筆", category: "Item", hint: "Pen", emoji: "🖊️" },
        { word: "pencil", translation: "鉛筆", category: "Item", hint: "Pencil", emoji: "✏️" },
        { word: "notebook", translation: "筆記本", category: "Item", hint: "Notebook", emoji: "📓" },
        { word: "teacher", translation: "老師", category: "People", hint: "Teacher", emoji: "👨‍🏫" },
        { word: "student", translation: "學生", category: "People", hint: "Student", emoji: "🧑‍🎓" },
        { word: "classroom", translation: "教室", category: "Location", hint: "Classroom", emoji: "🏫" },
        { word: "backpack", translation: "書包 / 雙肩包", category: "Item", hint: "Backpack", emoji: "🎒" },
        { word: "desk", translation: "書桌", category: "Item", hint: "Desk", emoji: "🪑" }
      ],
      sentences: [
        { english: "The student has a book.", translation: "這名學生有一本書。" },
        { english: "I write in the notebook.", translation: "我寫在筆記本上。" },
        { english: "The teacher is at school.", translation: "老師在學校。" }
      ]
    },
    {
      id: 4,
      name: "日常活動",
      description: "日常活動 — 學習日常習慣、動作與生活句型",
      icon: "⏰",
      vocab: [
        { word: "study", translation: "學習", category: "Action", hint: "To study", emoji: "🧠" },
        { word: "eat", translation: "吃", category: "Action", hint: "To eat", emoji: "🍴" },
        { word: "drink", translation: "喝", category: "Action", hint: "To drink", emoji: "🍹" },
        { word: "read", translation: "讀", category: "Action", hint: "To read", emoji: "👁️" },
        { word: "write", translation: "寫", category: "Action", hint: "To write", emoji: "✍️" },
        { word: "speak", translation: "說", category: "Action", hint: "To speak", emoji: "🗣️" },
        { word: "sleep", translation: "睡覺", category: "Action", hint: "To sleep", emoji: "😴" },
        { word: "play", translation: "玩耍", category: "Action", hint: "To play", emoji: "🧸" },
        { word: "friend", translation: "朋友", category: "People", hint: "Friend", emoji: "👦" },
        { word: "work", translation: "工作 / 勞動", category: "Action", hint: "To work", emoji: "💼" }
      ],
      sentences: [
        { english: "I like to read books.", translation: "我喜歡讀書。" },
        { english: "We study English.", translation: "我們學習英文。" },
        { english: "They play at school.", translation: "他們在學校玩耍。" }
      ]
    },
    {
      id: 5,
      name: "旅行與實用對話",
      description: "旅行與實用對話 — 掌握問路、問價格等生活旅遊語句",
      icon: "✈️",
      vocab: [
        { word: "airport", translation: "機場", category: "Travel", hint: "Airport", emoji: "✈️" },
        { word: "hotel", translation: "飯店 / 旅館", category: "Travel", hint: "Hotel", emoji: "🏨" },
        { word: "street", translation: "街道 / 馬路", category: "Travel", hint: "Street", emoji: "街道" },
        { word: "bathroom", translation: "洗手間", category: "Travel", hint: "Bathroom", emoji: "🚽" },
        { word: "where", translation: "哪裡", category: "Question", hint: "Where", emoji: "❓" },
        { word: "how much", translation: "多少", category: "Question", hint: "How much", emoji: "💰" },
        { word: "cost", translation: "花費 / 價值", category: "Question", hint: "Costs", emoji: "🏷️" },
        { word: "passport", translation: "護照", category: "Travel", hint: "Passport", emoji: "🛂" },
        { word: "taxi", translation: "計程車", category: "Travel", hint: "Taxi", emoji: "🚕" },
        { word: "city", translation: "城市", category: "Travel", hint: "City", emoji: "🏙️" }
      ],
      sentences: [
        { english: "Where is the bathroom?", translation: "洗手間在哪裡？" },
        { english: "How much does the bread cost?", translation: "這個麵包多少錢？" },
        { english: "I need a taxi.", translation: "我需要一台計程車。" }
      ]
    }
  ]
};

// Export if in Node context (for potential test scripts), else define globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VOCAB_DATABASE };
}
