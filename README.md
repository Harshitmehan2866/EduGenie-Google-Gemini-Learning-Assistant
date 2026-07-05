# 🎓 EduGenie – Google Gemini Powered Learning Assistant

EduGenie is an AI-powered educational web application built using **Flask** and the **Google Gemini API**. It provides students with an interactive learning experience through AI-powered question answering, real-time chat, quiz generation, and document summarization.

## 🚀 Features

- 💬 AI-powered Question Answering
- 🤖 Real-time AI Chat using Google Gemini
- 📝 Automatic Quiz Generation
- 📄 Document Summarization
- 🌍 Multilingual Support
- 📂 Upload and analyze PDF, DOCX, PPTX, and image files
- 🎨 Responsive and modern user interface

## 🛠️ Tech Stack

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Python
- Flask

**AI**
- Google Gemini API

**Libraries**
- google-genai
- python-dotenv
- PyPDF2
- python-docx
- python-pptx
- Pillow
- requests

## 📁 Project Structure

```
EduGenie/
│── static/
│   ├── style.css
│   └── script.js
│
│── templates/
│   └── index.html
│
│── uploads/
│
│── app.py
│── requirements.txt
│── README.md
│── .gitignore
│── .env
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/EduGenie-Google-Gemini-Learning-Assistant.git
cd EduGenie-Google-Gemini-Learning-Assistant
```

### 2. Create a virtual environment

**Windows**

```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/macOS**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure the environment

Create a `.env` file in the project root and add:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
SECRET_KEY=your_secret_key
```

### 5. Run the application

```bash
python app.py
```

Open your browser and visit:

```
http://127.0.0.1:5000
```

## 📦 Requirements

- Python 3.10 or above
- Flask
- Google Gemini API Key

Install all dependencies using:

```bash
pip install -r requirements.txt
```

## 🎯 Learning Outcomes

This project demonstrates:

- Flask Web Development
- Google Gemini API Integration
- Prompt Engineering
- AI-powered Educational Applications
- File Processing and Document Analysis
- Responsive Web Design
- RESTful API Development

## 🔮 Future Enhancements

- User Authentication
- Chat History
- Voice Assistant
- Flashcard Generation
- Dark Mode
- Learning Progress Dashboard
- Cloud Deployment

## 👨‍💻 Author

**Harshit Mehan**

B.Tech Computer Science Engineering

Developed as part of the **NASSCOM AI Internship Project**.

## 📄 License

This project is intended for educational and learning purposes.
