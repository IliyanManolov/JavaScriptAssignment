var Quiz_ns = Quiz_ns || {
    playerSelectors: document.getElementsByClassName('PlayerSelector'),
    themeSelectors: document.getElementsByClassName('ThemeSelector'),
    playerCount: 1,
    gameTheme: "HTML",
    playerColors: ["red", "blue", "green", "yellow"],
    allQuestionsData: {},
    gameData: {},
    isRoundPlaying: false,
    chosenQuestions: [],
    hasSelected: false,

    initPlayerSelection: function(){
        this.playerSelectors[0].style.fontWeight = "600"
        for (let i = 0; i < this.playerSelectors.length; i++){

            this.playerSelectors[i].addEventListener('click', () =>{
                var selectedOption = this.playerSelectors[i];
                var value = parseInt(selectedOption.getAttribute("data-value"));

                if (this.playerCount !== value){
                    this.playerCount = value;
                    this.resetFontWeight(this.playerSelectors);
                    selectedOption.style.fontWeight = "600";
                }
            });
        }        
    },

    initThemeSelection: function(){
        this.themeSelectors[0].style.fontWeight = "600"
        for (let i = 0; i < this.themeSelectors.length; i++){

            this.themeSelectors[i].addEventListener('click', () =>{
                var selectedOption = this.themeSelectors[i];
                var selectedTheme = selectedOption.getAttribute("data-value");

                if (this.gameTheme !== selectedTheme){
                    this.gameTheme = selectedTheme;
                    this.resetFontWeight(this.themeSelectors);
                    selectedOption.style.fontWeight = "600";
                }
            })
        }
    },

    initTabSelection: function(){
        var playerTab = document.getElementById('PlayersTab')
        var themeTab = document.getElementById('ThemeTab')
        var beginGameTab = document.getElementById('BeginGameTab')

        playerTab.addEventListener('click', () =>{
            this.themeSelectionContainer.style.display = 'none';
            themeTab.style.fontWeight = "500";

            playerTab.style.fontWeight = "600";
            this.playerSelectionContainer.style.display = 'flex';
        })

        themeTab.addEventListener('click', () =>{
            this.playerSelectionContainer.style.display = 'none';
            playerTab.style.fontWeight = "500";

            themeTab.style.fontWeight = "600";
            this.themeSelectionContainer.style.display = 'flex';
        })

        beginGameTab.addEventListener('click', () =>{
            let response = prompt(`Begin game on ${this.gameTheme} with ${this.playerCount} players? Y/N`)

            if (response !== null && response.toUpperCase() === "Y"){
                this.playerSelectionContainer.style.display = 'none';
                this.themeSelectionContainer.style.display = 'none';
                
                document.getElementsByClassName('TabsContainer')[0].style.display = 'none';
                document.getElementById('AnswerSelectionContainer').style.display = 'flex';
                document.getElementsByClassName('MainWrapper')[0].style.flexDirection = 'column';
                document.getElementById('QuestionContainer').style.display = 'flex';
                
                this.beginGame();
            }
            else{
                console.log("B")
            }
        })
    },

    resetFontWeight: function(targetArr){
        for (let i = 0; i < targetArr.length; i++){
            targetArr[i].style.fontWeight = "500"
        }
    },

    beginGame: async function(){
        this.currentGameQuestions = this.allQuestionsData[this.gameTheme];
        this.initStats();
        this.prepareQuestions();
        this.questionContainer = document.getElementById('QuestionContainer')
        this.answerSelectors = document.getElementsByClassName('AnswerSelector')
        this.secondsSpan = document.getElementById('clockSecondsSpan');

        this.currentPlayer = 1;
        this.currentRound = 1;
        this.questionContainer.innerText = this.currentQuestion.Question;
        this.setAnswers(this.currentRound);
        var playerSpan = document.getElementById('clockPlayerSpan');
        playerSpan.innerText = `Player${this.currentPlayer}`;
        playerSpan.style.color = this.gameData[`Player${this.currentPlayer}`].Color;


        for (let i = 0; i < this.answerSelectors.length; i++){
            this.answerSelectors[i].addEventListener('click', () =>{
                var chosenAnswer = this.answerSelectors[i].innerText;

                console.log(`${chosenAnswer} <- chosen`);
                console.log(this.currentQuestion)
                console.log(this.currentQuestion.CorrectAnswer)
                if (chosenAnswer === this.currentQuestion.CorrectAnswer){
                    this.gameData[`Player${this.currentPlayer}`].Score += 10;
                }

                this.gameData[`Player${this.currentPlayer}`].ChosenAnswers.push(chosenAnswer);

                if (this.answerSelectors[i].style.borderColor === "black"){
                    this.answerSelectors[i].style.borderColor = this.gameData[`Player${this.currentPlayer}`].Color;
                }
                else{
                    this.answerSelectors[i].style.borderColor += ` ${this.gameData[`Player${this.currentPlayer}`].Color}`;
                }

                this.currentPlayer++;

                if (this.currentPlayer < this.playerCount){
                    playerSpan.innerText = `Player${this.currentPlayer}`;
                    playerSpan.style.color = this.gameData[`Player${this.currentPlayer}`].Color;
                }

                if (this.currentPlayer > this.playerCount){
                    this.currentRound++;
                    this.resetAnswerBorders();
                    this.currentPlayer = 1;
                    playerSpan.innerText = `Player${this.currentPlayer}`;
                    playerSpan.style.color = this.gameData[`Player${this.currentPlayer}`].Color;
                    if (this.currentRound !== 11){
                        this.setAnswers(this.currentRound);
                        this.questionContainer.innerText = this.chosenQuestions[this.currentRound - 1].Question;
                        this.currentQuestion = this.chosenQuestions[this.currentRound - 1]
                    }
                }

                if (this.currentRound === 11){
                    this.endGame();
                }
            })
        }
    },

    resetAnswerBorders: function(){

        for (let i = 0; i < this.answerSelectors.length; i++){
            this.answerSelectors[i].style.borderColor = "black";
        }
    },

    setAnswers: function(roundNum){
        let roundAnswers = this.chosenQuestions[roundNum - 1].Answers
        for (let i = 0; i < this.answerSelectors.length; i++){
            this.answerSelectors[i].innerText = roundAnswers[i];
        }
    },

    prepareQuestions: function(){
        for (let i = 0; i < 10; i++){
            let randomIndex = Math.floor(Math.random() * this.currentGameQuestions.length);
            let randomElement = this.currentGameQuestions.splice(randomIndex, 1)[0];
            // this.currentQuestion = randomElement;
            this.chosenQuestions.push(randomElement);
        }
        this.currentQuestion = this.chosenQuestions[0]
        console.log(this.chosenQuestions)
    },

    // ! STORE ALL QUESTIONS CHOSEN IN AN ARRAY, NEED TO STORE WHICH PLAYER ANSWERED WHAT TO EACH QUESTION
    // ! END REVIEW: Question - correct answer; who gave what answer

    initStats: function(){
        for (let i = 1; i <= this.playerCount; i++){
            this.gameData[`Player${i}`] = this.createPlayer(this.playerColors[i - 1])
        }
    },

    createPlayer: function(inputColor){
        let newPlayer = {};
        newPlayer["Color"] = inputColor;
        newPlayer["ChosenAnswers"] = [];
        newPlayer["Score"] = 0;
        return newPlayer;
    },

    endGame: function(){

        this.resultTable = document.createElement('table');
        this.resultTable.appendChild(this.createHeaderRow())

        for (let i = 0; i < 10; i++){
            this.resultTable.appendChild(this.createResultRow(i))
        }
        document.getElementsByClassName('SelectedTabContainer')[0].style.display = 'none'
        
        var mainWrapper = document.getElementsByClassName('MainWrapper')[0];
        mainWrapper.appendChild(this.resultTable);
        mainWrapper.appendChild(this.createScoreTable());
    },

    createResultRow: function(index){
        
        let row = document.createElement('tr')
        let question = this.chosenQuestions[index]
        row.appendChild(this.createTableCell(question.Question, "td"))
        row.appendChild(this.createTableCell(question.CorrectAnswer, "td"))
        for (let i = 1; i <= this.playerCount; i++){
            row.appendChild(this.createTableCell( this.gameData[`Player${i}`].ChosenAnswers[index], "th"))
        }
        return row;
    },

    createScoreTable: function(){
        let table = document.createElement('table');
        
        let headerRow = document.createElement('tr');
        headerRow.appendChild(this.createTableCell("Player", "th"))
        headerRow.appendChild(this.createTableCell("Score", "th"))

        table.appendChild(headerRow);
        
        let players = [];

        for (let i = 1; i <= this.playerCount; i++){
            // headerRow.appendChild(this.createTableCell(`Player${i}`, "th"))
            players.push(this.gameData[`Player${i}`])
        }
        
        players.sort((a,b) =>{
            return b.Score - a.Score
        })

        for (let i = 0; i < players.length; i++){
            let row = document.createElement('tr');

            row.appendChild(this.createTableCell(`Player${i + 1}`, "td"))
            row.appendChild(this.createTableCell(`${players[i].Score}`, "td"))

            table.appendChild(row)
        }

        return table;
    },

    createHeaderRow: function(){
        let headerRow = document.createElement('tr');
        headerRow.appendChild(this.createTableCell("Question", "th"))
        headerRow.appendChild(this.createTableCell("CorrectAnswer", "th"))

        for (let i = 1; i <= this.playerCount; i++){
            headerRow.appendChild(this.createTableCell(`Player${i}`, "th"))
        }

        return headerRow;
    },

    createTableCell: function(text, cellType){
        var cell = document.createElement(cellType);
        cell.textContent = text;

        return cell;
    },

    init: async function(){

        this.playerSelectionContainer = document.getElementById('PlayerSelectionContainer');
        this.themeSelectionContainer = document.getElementById('ThemeSelectionContainer');
        this.allQuestionsData = await fetch('./data.json').then((res) => res.json());
        this.initPlayerSelection();
        this.initTabSelection();
        this.initThemeSelection();
    }


};

document.addEventListener('DOMContentLoaded', () =>{
    Quiz_ns.init();
})