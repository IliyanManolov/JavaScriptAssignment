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
        this.questionContainer = document.getElementById('QuestionContainer')
        this.answerSelectors = document.getElementsByClassName('AnswerSelector')
        this.secondsSpan = document.getElementById('clockSecondsSpan');
        // console.log(this.currentGameQuestions);
        // console.log(this.questionContainer);
        // for (let i = 0; i < this.answerSelectors.length; i++){
        //     this.answerSelectors[i].addEventListener('click', () =>{

        //         var chosenAnswer = this.answerSelectors[i].innerText;

        //         if (chosenAnswer === this.currentQuestion.CorrectAnswer){
        //             this.gameData[`Player${this.currentPlayer}`].Score += 10;
        //         }

        //         this.gameData[`Player${this.currentPlayer}`].ChosenAnswers.push(chosenAnswer);
        //         this.currentPlayer++;
        //         this.hasSelected = true;
        //     })
        // }

        for (let i = 1; i <= 10; i++){

            await this.playRound(i);
        }
        console.log(this.gameData);
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

    playRound: async function(roundNum){
        let randomIndex = Math.floor(Math.random() * this.currentGameQuestions.length);
        let randomElement = this.currentGameQuestions.splice(randomIndex, 1)[0];
        this.questionContainer.innerText = randomElement.Question;
        this.currentQuestion = randomElement;
        this.chosenQuestions.push(randomElement);
        // var playerSpan = document.getElementById('clockPlayerSpan');

        for (let j = 0; j < 4; j++){
            this.answerSelectors.innerText = this.currentQuestion.Answers[j] 
        }

        this.isRoundPlaying = true;
        this.currentRound = roundNum;
        for (let i = 0; i < this.playerCount; i++){
            this.currentPlayer = i + 1;
            await this.playerPick(i + 1);
            console.log(i)
        }
        this.isRoundPlaying = false;
        this.currentRound++;
        console.log(this.gameData)
    },

    playerPick: async function(playerNum){
        const promises = Array.from(Quiz_ns.answerSelectors).map(Quiz_ns.createPromise);

        Promise.race(promises).then((answerDiv) => Quiz_ns.handlePlayerChoice(playerNum, answerDiv))
    },

    handlePlayerChoice: function(playerNumber, answerDiv){
        var chosenAnswer = answerDiv.innerText;
        console.log('a')
        if (chosenAnswer === Quiz_ns.currentQuestion.CorrectAnswer){
            Quiz_ns.gameData[`Player${playerNumber}`].Score += 10;
        }

        Quiz_ns.gameData[`Player${playerNumber}`].ChosenAnswers.push(chosenAnswer);
    },

    createPromise: function(element){
        return new Promise((resolve) => {
            element.addEventListener('click', () =>{
                resolve(element)
            })
        })
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