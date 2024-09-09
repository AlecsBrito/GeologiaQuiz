let currentQuestionIndex = 0;
let correctAnswers = 0; // Contagem de respostas corretas
let questions = [];

// Função para carregar perguntas do arquivo JSON
async function loadQuestions() {
    try {
        const response = await fetch('../perguntas.json'); // Caminho corrigido para o JSON
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON');
        }
        questions = await response.json();
        // Embaralha as perguntas ao carregar
        questions = shuffleArray(questions);
        loadQuestion();
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para carregar a pergunta atual na página
function loadQuestion() {
    if (questions.length === 0) return; // Se não há perguntas, sair

    const question = questions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');

    // Obter as opções e embaralhá-las
    const shuffledOptions = shuffleArray(Object.entries(question.options));

    questionContainer.innerHTML = `
        <p>${question.question}</p>
        <div class="content">
        <img id="question-image" class="question-image" alt="Imagem da pergunta" style="display: none;">
            <div class="opcoes">
            ${shuffledOptions.map(([key, value]) => `
                <input type="radio" name="option" value="${key}" id="option-${key}">
                <label for="option-${key}" id="label-${key}">${value}</label><br>
                `).join('')}
            </div>
        </div>
    `;

    // Exibir a imagem se existir
    const questionImage = document.getElementById('question-image');
    if (question.image) {
        questionImage.src = question.image; // Define a URL da imagem
        questionImage.style.display = 'block'; // Exibe a imagem
    } else {
        questionImage.style.display = 'none'; // Oculta se não houver imagem
    }

    // Exibir o botão de verificação e esconder o botão de próxima pergunta
    document.getElementById('check-answer').classList.remove('hidden');
    document.getElementById('next-question').classList.add('hidden');
}

// Função para embaralhar um array (usada para perguntas e opções)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para verificar a resposta selecionada
function checkAnswer() {
    if (questions.length === 0) return;

    const question = questions[currentQuestionIndex];
    const selectedOption = document.querySelector('input[name="option"]:checked');

    if (selectedOption) {
        const selectedValue = selectedOption.value;
        const correctOption = question.answer;

        // Colorir todas as opções após a resposta
        Object.keys(question.options).forEach(key => {
            const label = document.getElementById(`label-${key}`);
            const radioInput = document.getElementById(`option-${key}`);

            if (key === correctOption) {
                label.classList.add('correct');
            } else if (key === selectedValue) {
                label.classList.add('incorrect');
            }

            // Desabilitar todos os inputs de rádio
            radioInput.disabled = true;
        });

        // Se a resposta estiver correta, incrementa o número de acertos
        if (selectedValue === correctOption) {
            correctAnswers++;
        }

        // Esconder o botão de verificação e exibir o botão de próxima pergunta
        document.getElementById('check-answer').classList.add('hidden');
        document.getElementById('next-question').classList.remove('hidden');
    }
}

// Função para carregar a próxima pergunta ou redirecionar para a página de pontuação
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        // Calcula a porcentagem de acertos e redireciona para a página de pontuação
        const finalPercentage = Math.round((correctAnswers / questions.length) * 100);
        window.location.href = `pontos.html?correctAnswers=${correctAnswers}&totalQuestions=${questions.length}&percentage=${finalPercentage}`;
    }
}

// Carregar perguntas ao carregar a página
window.onload = function () {
    document.getElementById('check-answer').addEventListener('click', checkAnswer);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    loadQuestions();
};
