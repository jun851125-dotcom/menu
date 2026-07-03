// Brazilian Portuguese Vocabulary Database for Middle/High School levels
const VOCAB_DATABASE = {
  levels: [
    {
      id: 1,
      name: "Saudações & Básico",
      description: "問候與基礎單字 — 學習打招呼、感謝及基本回應",
      icon: "👋",
      vocab: [
        { word: "Olá", translation: "你好", category: "Greeting", hint: "Hello (通用問候)", emoji: "👋" },
        { word: "Bom dia", translation: "早上好", category: "Greeting", hint: "Good morning", emoji: "☀️" },
        { word: "Boa tarde", translation: "下午好", category: "Greeting", hint: "Good afternoon", emoji: "🌤️" },
        { word: "Boa noite", translation: "晚安 / 晚上好", category: "Greeting", hint: "Good night or evening", emoji: "🌙" },
        { word: "Por favor", translation: "請", category: "Politeness", hint: "Please", emoji: "🙏" },
        { word: "Obrigado", translation: "謝謝 (男生說)", category: "Politeness", hint: "Thank you (masculine)", emoji: "👦" },
        { word: "Obrigada", translation: "謝謝 (女生說)", category: "Politeness", hint: "Thank you (feminine)", emoji: "👧" },
        { word: "Tudo bem?", translation: "你好嗎？ / 一切都好嗎？", category: "Greeting", hint: "How are you? / Is everything fine?", emoji: "😊" },
        { word: "Sim", translation: "是", category: "Basic", hint: "Yes", emoji: "👍" },
        { word: "Não", translation: "不", category: "Basic", hint: "No", emoji: "👎" }
      ],
      sentences: [
        { portuguese: "Olá, tudo bem?", translation: "你好，你好嗎？" },
        { portuguese: "Bom dia, obrigado!", translation: "早上好，謝謝！" },
        { portuguese: "Sim, por favor.", translation: "是的，請。" }
      ]
    },
    {
      id: 2,
      name: "Comida & Bebida",
      description: "食物與飲料 — 學習常見的水果、點心與日常飲品",
      icon: "🍔",
      vocab: [
        { word: "água", translation: "水", category: "Drink", hint: "Water", emoji: "💧" },
        { word: "chá", translation: "茶", category: "Drink", hint: "Tea", emoji: "🍵" },
        { word: "café", translation: "咖啡", category: "Drink", hint: "Coffee", emoji: "☕" },
        { word: "pão", translation: "麵包", category: "Food", hint: "Bread", emoji: "🍞" },
        { word: "sanduíche", translation: "三明治", category: "Food", hint: "Sandwich", emoji: "🥪" },
        { word: "maçã", translation: "蘋果", category: "Food", hint: "Apple", emoji: "🍎" },
        { word: "leite", translation: "牛奶", category: "Drink", hint: "Milk", emoji: "🥛" },
        { word: "suco", translation: "果汁", category: "Drink", hint: "Juice", emoji: "🥤" },
        { word: "queijo", translation: "起司", category: "Food", hint: "Cheese", emoji: "🧀" },
        { word: "arroz", translation: "米飯", category: "Food", hint: "Rice", emoji: "🍚" }
      ],
      sentences: [
        { portuguese: "Eu quero um sanduíche.", translation: "我想要一個三明治。" },
        { portuguese: "Eu bebo água e café.", translation: "我喝水和咖啡。" },
        { portuguese: "Ela come pão com queijo.", translation: "她吃麵包配起司。" }
      ]
    },
    {
      id: 3,
      name: "Escola & Estudos",
      description: "學校與學習 — 探索教室用品、科目與學習相關單字",
      icon: "🎒",
      vocab: [
        { word: "escola", translation: "學校", category: "Location", hint: "School", emoji: "🏫" },
        { word: "livro", translation: "書本", category: "Item", hint: "Book", emoji: "📖" },
        { word: "caneta", translation: "原子筆", category: "Item", hint: "Pen", emoji: "🖊️" },
        { word: "lápis", translation: "鉛筆", category: "Item", hint: "Pencil", emoji: "✏️" },
        { word: "caderno", translation: "筆記本", category: "Item", hint: "Notebook", emoji: "📓" },
        { word: "professor", translation: "老師 (男)", category: "People", hint: "Teacher (masculine)", emoji: "👨‍🏫" },
        { word: "professora", translation: "老師 (女)", category: "People", hint: "Teacher (feminine)", emoji: "👩‍🏫" },
        { word: "estudante", translation: "學生", category: "People", hint: "Student", emoji: "🧑‍🎓" },
        { word: "aula", translation: "課程", category: "Activity", hint: "Class / Lesson", emoji: "📚" },
        { word: "mochila", translation: "書包 / 雙肩包", category: "Item", hint: "Backpack", emoji: "🎒" }
      ],
      sentences: [
        { portuguese: "O estudante tem um livro.", translation: "這名學生有一本書。" },
        { portuguese: "Eu escrevo no caderno.", translation: "我寫在筆記本上。" },
        { portuguese: "A professora está na school.", translation: "老師在學校。" } // Wait, let's make it correct Portuguese: "A professora está na escola."
      ]
    },
    {
      id: 4,
      name: "Atividades Diárias",
      description: "日常活動 — 學習日常習慣、動作與生活句型",
      icon: "⏰",
      vocab: [
        { word: "estudar", translation: "學習", category: "Action", hint: "To study", emoji: "🧠" },
        { word: "comer", translation: "吃", category: "Action", hint: "To eat", emoji: "🍴" },
        { word: "beber", translation: "喝", category: "Action", hint: "To drink", emoji: "🍹" },
        { word: "ler", translation: "讀", category: "Action", hint: "To read", emoji: "👁️" },
        { word: "escrever", translation: "寫", category: "Action", hint: "To write", emoji: "✍️" },
        { word: "falar", translation: "說", category: "Action", hint: "To speak", emoji: "🗣️" },
        { word: "dormir", translation: "睡覺", category: "Action", hint: "To sleep", emoji: "😴" },
        { word: "brincar", translation: "玩耍", category: "Action", hint: "To play (children)", emoji: "🧸" },
        { word: "amigo", translation: "朋友 (男)", category: "People", hint: "Friend (masculine)", emoji: "👦" },
        { word: "amiga", translation: "朋友 (女)", category: "People", hint: "Friend (feminine)", emoji: "👧" }
      ],
      sentences: [
        { portuguese: "Eu gosto de ler livros.", translation: "我喜歡讀書。" },
        { portuguese: "Nós estudamos português.", translation: "我們學習葡萄牙語。" },
        { portuguese: "Eles brincam na escola.", translation: "他們在學校玩耍。" }
      ]
    },
    {
      id: 5,
      name: "Viagem & Expressões",
      description: "旅行與實用對話 — 掌握問路、問價格等生活旅遊語句",
      icon: "✈️",
      vocab: [
        { word: "aeroporto", translation: "機場", category: "Travel", hint: "Airport", emoji: "✈️" },
        { word: "hotel", translation: "飯店 / 旅館", category: "Travel", hint: "Hotel", emoji: "🏨" },
        { word: "rua", translation: "街道 / 馬路", category: "Travel", hint: "Street", emoji: "🛣️" },
        { word: "banheiro", translation: "洗手間", category: "Travel", hint: "Bathroom", emoji: "🚽" },
        { word: "onde", translation: "哪裡", category: "Question", hint: "Where", emoji: "❓" },
        { word: "quanto", translation: "多少", category: "Question", hint: "How much", emoji: "💰" },
        { word: "custa", translation: "花費 / 價值", category: "Question", hint: "Costs", emoji: "🏷️" },
        { word: "passaporte", translation: "護照", category: "Travel", hint: "Passport", emoji: "🛂" },
        { word: "táxi", translation: "計程車", category: "Travel", hint: "Taxi", emoji: "🚕" },
        { word: "cidade", translation: "城市", category: "Travel", hint: "City", emoji: "🏙️" }
      ],
      sentences: [
        { portuguese: "Onde fica o banheiro?", translation: "洗手間在哪裡？" },
        { portuguese: "Quanto custa o pão?", translation: "這個麵包多少錢？" },
        { portuguese: "Eu preciso de um táxi.", translation: "我需要一台計程車。" }
      ]
    }
  ]
};

// Fix the typo in Level 3 sentence (na school -> na escola)
VOCAB_DATABASE.levels[2].sentences[2].portuguese = "A professora está na escola.";

// Export if in Node context (for potential test scripts), else define globally
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VOCAB_DATABASE };
}
