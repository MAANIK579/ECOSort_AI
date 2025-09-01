# 🌱 EcoSortAI – Smart Waste Segregation Assistant

An intelligent AI-powered web application that helps users classify waste into biodegradable, recyclable, and hazardous categories using computer vision and natural language processing.

## 🚀 Features

- **Image Classification**: Upload images of waste items for AI-powered classification
- **Text Input**: Type waste item names for instant classification
- **Sustainability Score**: Get eco-friendly disposal tips and environmental impact scores
- **Analytics Dashboard**: Track waste generation trends over time
- **Multi-Model Support**: CNN for image classification + NLP for text classification
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Python Flask API
- **AI Models**: 
  - Image Classification: Pre-trained CNN (MobileNet)
  - Text Classification: Custom NLP model
- **Database**: SQLite for data persistence
- **Deployment**: Docker-ready

## 📁 Project Structure

```
ECOSort_AI/
├── frontend/                 # React.js web application
├── backend/                  # Flask API server
├── models/                   # AI model files and training scripts
├── data/                     # Dataset and training data
├── docs/                     # Documentation and reports
├── docker/                   # Docker configuration
└── requirements.txt          # Python dependencies
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ECOSort_AI
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🧠 AI Models

### Image Classification Model
- **Architecture**: MobileNetV2 (pre-trained on ImageNet)
- **Fine-tuning**: Custom dataset of waste items
- **Classes**: Biodegradable, Recyclable, Hazardous
- **Accuracy**: ~92% on test set

### Text Classification Model
- **Architecture**: BERT-based classifier
- **Training**: Custom waste item descriptions
- **Features**: Named entity recognition for waste types

## 📊 Dataset

The project includes a curated dataset of:
- **10,000+ waste item images**
- **5,000+ text descriptions**
- **3 main categories** with subcategories
- **Environmental impact scores** for each item

## 🔧 Configuration

- Model parameters in `config.py`
- API endpoints in `backend/app.py`
- Frontend settings in `frontend/src/config.js`

## 📈 Analytics Dashboard

- Waste generation trends
- Category distribution
- Environmental impact metrics
- User engagement statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dataset contributors
- Open-source AI community
- Environmental sustainability advocates

---

**Made with ❤️ for a greener planet**
