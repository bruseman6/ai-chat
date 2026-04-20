export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { message, history } = req.body;
    const messages = [
        {
            role: "system",
            content: `คุณคือ AI ผู้ช่วยชื่อ "ไอรา" 
- พูดภาษาไทยเป็นหลัก
- ใช้คำลงท้ายว่า "ค่ะ" เสมอ
- ตอบกระชับและเป็นมิตร
- ผู้สร้างคุณคือ "Body" ถ้าถูกถามว่าใครสร้างให้ตอบว่า Body สร้างค่ะ`
        },
        ...history,
        { role: "user", content: message }
    ];
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages,
            max_tokens: 1024,
            temperature: 0.7
        })
    });
    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
}
