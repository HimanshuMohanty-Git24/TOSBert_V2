# 📜 TOSBertV2: Terms of Service Fairness Classifier 🤖

[![made-with-python](https://img.shields.io/badge/Made%20with-Python-1f425f.svg)](https://www.python.org/)
[![made-with-react](https://img.shields.io/badge/Made%20with-React-61DAFB.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TOSBertV2 is an advanced Terms of Service (ToS) fairness classifier that uses state-of-the-art natural language processing techniques to analyze and categorize clauses in ToS agreements. This tool helps users quickly identify potentially unfair or problematic clauses in legal documents.

## 👨‍💻 Demo


https://github.com/HimanshuMohanty-Git24/TOSBert_V2/assets/94133298/0c36ad27-67cb-4a55-a941-4afd02957365



## 🌟 Features

- 🧠 Utilizes a fine-tuned BERT model for accurate classification
- 📊 Provides detailed analysis of ToS documents
- 📁 Supports both PDF and text input
- 🌓 Dark mode support for comfortable viewing
- 🚀 Fast and efficient processing
- 🖥️ User-friendly web interface

## 🛠️ Tech Stack

- Backend:
  - Flask
  - PyTorch
  - Transformers (Hugging Face)
  - spaCy
  - PyPDF2
- Frontend:
  - React
  - Material-UI
  - Axios

## 📂 Project Structure

```
TOSBertV2/
│
├── backend/
│   ├── venv/
│   ├── app.py
│   └── requirements.txt
│
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    ├── package.json
    └── package-lock.json
```

## 🚀 Getting Started

### Prerequisites

- Python 3.7+
- Node.js 12+
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/TOSBertV2.git
   cd TOSBertV2
   ```

2. Set up the backend:
   ```
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   pip install -r requirements.txt
   python -m spacy download en_core_web_sm
   ```

3. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   flask run
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to use the application.

## 🧠 Model Information

- **Model Name**: [CodeHima/TOSBertV2](https://huggingface.co/CodeHima/TOSBertV2)
- **Dataset**: [TOS_Dataset](https://huggingface.co/datasets/CodeHima/TOS_Dataset)
- **Base Model**: BERT (Bidirectional Encoder Representations from Transformers)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/TOSBertV2/issues).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Hugging Face](https://huggingface.co/) for providing the Transformers library and model hosting
- [Material-UI](https://material-ui.com/) for the beautiful React components
- [Flask](https://flask.palletsprojects.com/) for the lightweight backend framework

## 📞 Contact

Himanshu Mohanty - [@CodingHima](https://twitter.com/CodingHima) - codehimanshu24@gmail.com

Project Link: [https://github.com/yourusername/TOSBertV2](https://github.com/HimanshuMohanty-Git24/TOSBertV2)

---

Made with ❤️ and ☕ by [Himanshu Mohanty](https://github.com/HimanshuMohanty-Git24?tab=repositories)
