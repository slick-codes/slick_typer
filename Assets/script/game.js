(() => {

    const inputWord = document.querySelector('.input-section .input-word')
    const wordOutput = document.querySelector('.word-section .word')


    class GameFunctionality {
        constructor() {
            this.currentWord = undefined
            this.previousWord = undefined
            this.index = 0
            this.play = false
            this.word = 0
            this.wordIndex = 0
            this.score = 0
            this.countDownTimer = 5
            this.startGame = false
            this.getWordLength = 'infinite'
            this.intervalSpeed = this.getLocalStorage().default.deficulty
            this.gameMode = 'play' // Practise Mode (with no time), Main Game , Custome Mode (optioaal)
        }


        getLocalStorage() {
            const customeValue = window.localStorage.getItem('customeValue')
            // Store the defaultValue to the local storage so that it can be changed and customized
            if (customeValue === null) {
                window.localStorage.setItem('customeValue', JSON.stringify(defaultValue))
            }
            return JSON.parse(window.localStorage.getItem('customeValue'))
        }

        generateRandomWord() { // Generate a random word from the dictionary


            // run the function again if the current  word was the same as previous word
            document.querySelectorAll(' .word span').forEach(
                node => node.remove()
            )

            let random = Math.round(Math.random() * (this.getLocalStorage().dictionary.length - 1))
            this.currentWord = random

            if (this.currentWord === this.previousWord) {
                this.generateRandomWord()
                return
            }

            let word = this.getLocalStorage().dictionary[this.currentWord]

            for (let i = 0; i < word.length; i++) {
                let span = document.createElement('span')
                span.innerHTML = word[i]

                wordOutput.appendChild(span)
                this.word = word
            }

            this.previousWord = this.currentWord

            this.word = word
        }

        /*///////////////////////////////*/
        //Generate Words in Sequence

        generateSequenceWord() { // this function generates words based on the dictionary's sequencial order

            wordOutput.querySelectorAll('*').forEach(node => node.remove()) // Remove any exsiting html elements
            if (this.index >= this.getLocalStorage().dictionary.length) this.index = 0 // reset the word to one if condition is met
            let word = this.getLocalStorage().dictionary[this.index]

            for (let i = 0; i < word.length; i++) {
                let span = document.createElement('span')
                span.innerHTML = word[i]

                wordOutput.appendChild(span)
            }

            this.index++
            this.word = word
        }

        checkWordType() {
            (this.getLocalStorage().default.gameStyle === 'random') ? this.generateRandomWord(): this.generateSequenceWord()
        }

        reset() {
            wordOutput.querySelectorAll('span').forEach(node => node.remove())
            document.querySelector('#game-over').classList.remove('active')
            document.querySelector('#game').classList.remove('fade')

            inputWord.blur()
            inputWord.value = ''
            this.score = 0
            this.play = false
            this.startGame = false
            this.getWordLength = 'infinite'
            this.index = 0
            //console.log('resetarted');
            this.updateData()
        }

        updateData() {
            document.querySelector('#score-output').innerText = this.score
            document.querySelector('.output-deficulty span').innerText = this.getLocalStorage().default.deficulty.name
            document.querySelector('#time-output').innerText = this.getWordLength;
            document.querySelector('.finalScore span').innerText = this.score
            document.querySelector('.current-winner h1 span').innerText = this.getLocalStorage().highScore.score
            document.querySelector('.current-winner h2 span').innerText = this.getLocalStorage().highScore.name
        }

        setTimeOut() {
            let index = 4;
            const countDownBody = document.querySelector('#count-down');
            const span = document.createElement('span')

            const countSpan = document.querySelector('#count-down span')

            const setCountDown = () => {

                if (countSpan !== null) {
                    countSpan.remove()
                    // console.log('deleted node')
                }

                span.innerText = index
                if (index <= 0) {
                    clearInterval(interval, 1000)

                    document.querySelector('#count-down').style.display = 'none'
                    inputWord.focus()
                    index = 5
                    span.innerText = index
                    countDownBody.appendChild(span)
                    //console.log(span)
                    return
                }
                countDownBody.appendChild(span)
                index--
                //console.log(index)
            }
            let interval = setInterval(setCountDown, 1000)
        }

        clickStartBtn() {
            document.querySelector('#count-down').style.display = 'flex'
            this.reset()
            this.setTimeOut()
        }

        saveHighScore() {
            let saveDetails = this.getLocalStorage();

            saveDetails.highScore.name = document.querySelector('#inputedName').value;
            saveDetails.highScore.score = this.score

            window.localStorage.setItem('customeValue', JSON.stringify(saveDetails))

            let customeValue = JSON.parse(window.localStorage.getItem('customeValue'));

            //console.log(this.getLocalStorage().highScore)
        }

        updateHighScore() {
            document.querySelectorAll('.social-handle-name').forEach(node => {
                node.innerText = this.getLocalStorage().highScore.name
                //console.log(this.getLocalStorage().highScore.name)
            })
            document.querySelectorAll('.highscore-output').forEach(node => {
                node.innerText = this.getLocalStorage().highScore.score
                //console.log(this.getLocalStorage().highScore.score, 'nale')
            })
        }

        inputingWord() {

            if (event.type === 'focus' && this.play === true || event.type === 'space') return

            if (!this.play && this.gameMode === 'marathon') this.getWordLength = 50

            // console.log(this.gameMode)
            //console.log(this.getWordLength)

            if (event.target.value === this.word /* || event.type === 'focus'*/ && this.gameMode === 'game')
                this.getWordLength = this.word.length + 1


            let interval;

            if (this.startGame === false && this.gameMode !== 'practise') {
                interval = setInterval(() => {
                    this.getWordLength--
                    this.updateData()
                    if (this.getWordLength <= 0) {
                        interval = clearInterval(interval, 100)
                        //this.reset()
                        this.updateData()
                        inputWord.blur()
                        document.querySelector('#game').classList.add('fade')

                        if (this.score > this.getLocalStorage().highScore.score) {
                            document.querySelector('.beating-highscore').classList.add('active')
                            document.querySelector('.pop-out').innerText = this.score
                            return
                        }
                        document.querySelector('#game-over').classList.add('active')

                        return
                    }
                }, this.getLocalStorage().default.deficulty.speed)
                this.startGame = true
            }

            if (event.target.value === this.word && event.type !== 'focus') {
                this.score++
            }

            if (event.target.value === this.word || event.type === 'focus') {
                this.checkWordType()

                if (this.gameMode === 'game') {
                    this.getWordLength = this.word.length + 1
                }

                event.target.value = ''
            }
            let convertValueToString = event.target.value
            const span = document.querySelectorAll('.word-section .word span')

            for (let i = 0; i < this.word.length; i++) { // highlight text that have been typed
                if (convertValueToString[i] === span[i].innerText) {
                    span[i].classList.add('--modifier')
                }

            }

            for (let i = 0; i < convertValueToString.length; i++) { // Remove the last later of the word if the character typed is wrong
                if (convertValueToString[i] !== span[i].innerText && event.target.type !== 'focus') {
                    event.target.value = convertValueToString.substring(0, convertValueToString.length - 1)
                    return
                }
            }
            this.updateData()
            this.play = true
        }

        theme() {
            let stored = this.getLocalStorage()
            let root = document.documentElement;

            if (stored.default.darkMode) {
                root.style.setProperty('--black', '#f0f0f0')
                root.style.setProperty('--green', '#14af71')
                root.style.setProperty('--white', '#000000')
                root.style.setProperty('--darkgreen', '#0a6044')
                stored.default.darkMode = false
                event.target.classList.remove('active')
            } else {
                root.style.removeProperty('--black');
                root.style.removeProperty('--green');
                root.style.removeProperty('--white');
                root.style.removeProperty('--darkgreen');
                stored.default.darkMode = true
                event.target.classList.add('active');
            }
            /*event.target.classList.toggle('active')*/
            //console.dir(event)
            window.localStorage.setItem('customeValue', JSON.stringify(stored))
        }

        setDeficulty() {
            let stored = this.getLocalStorage()
            switch (event.target.value) {
                case 'easy':
                    stored.default.deficulty.speed = 1000
                    break;
                case 'normal':
                    stored.default.deficulty.speed = 500
                    break;
                case 'hard':
                    stored.default.deficulty.speed = 350
            }
            stored.default.deficulty.name = event.target.value
            //update the storage
            window.localStorage.setItem('customeValue', JSON.stringify(stored))
        }

        addNewWord() {
            const newWordInput = document.querySelector('#new-word')
            const log = document.querySelector('#word-log span');
            const icon = document.querySelector('#word-log i')

            const noSpaceAllowed = 'No Space Allowed'
            const good = 'has been added added'
            const exist = 'is in the dictionary already'

            let err = function () {
                log.parentElement.parentElement.classList.remove('added')
                log.parentElement.parentElement.classList.add('err')
                icon.classList.remove('fa-check')
                icon.classList.add('fa-warning')
            }
            let added = function () {
                log.innerText = newWordInput.value + ' ' + good;
                log.parentElement.parentElement.classList.remove('err')
                log.parentElement.parentElement.classList.add('added')
                icon.classList.remove('fa-worning')
                icon.classList.add('fa-check')
                newWordInput.select()
                stored.dictionary.push(newWordInput.value.trimRight())
                //console.log(stored.dictionary[stored.dictionary.length - 1])
            }
            let myArray = []
            for (let i = 0; i < newWordInput.value.length; i++) {
                //myArray.push[newWordInput.value]

                if (newWordInput.value[i] === ' ') {
                    err();
                    log.innerText = noSpaceAllowed
                    return
                    //break;
                }
            }

            if (newWordInput.value.length > 17) {
                err()
                log.innerText = `" ${newWordInput.value} " is longer than 17`;
                return
            } else if (newWordInput.value.length < 3) {
                err()
                log.innerText = `" ${newWordInput.value} " is shoter than 3`
                return
            }

            if (newWordInput.value.trimRight() === '') {
                err()
                log.innerText = 'the fill is empty '
                return
            }
            let wordExist = false
            this.getLocalStorage().dictionary.forEach(word => {
                if (word.toLowerCase() == newWordInput.value.toLowerCase()) wordExist = true
            })
            //console.log(wordExist)
            if (wordExist) {
                log.innerText = `" ${ newWordInput.value} " ${exist}`;
                err()
                return
            }
            const stored = this.getLocalStorage();
            added()
            window.localStorage.setItem('customeValue', JSON.stringify(stored))
        }
    }
    const setGame = new GameFunctionality();
    //console.log(setGame)
    const loadedSetting = function () {
        const root = document.documentElement;
        if (!setGame.getLocalStorage().default.darkMode) {
            root.style.setProperty('--black', '#f0f0f0')
            root.style.setProperty('--green', '#14af71')
            root.style.setProperty('--white', '#1d1d1d')
            root.style.setProperty('--darkgreen', '#0a6044')
        } else {
            root.style.removeProperty('--black');
            root.style.removeProperty('--green');
            root.style.removeProperty('--white');
            root.style.removeProperty('--darkgreen');
        }

        setGame.updateHighScore()
        if (setGame.getLocalStorage().default.darkMode) document.querySelector('.toggle-body').classList.add('active')
        document.querySelector('#select-deficulty').value = setGame.getLocalStorage().default.deficulty.name
    }

    window.addEventListener('load', loadedSetting)

    // Add a new word to the Dictionary
    document.querySelector('#add-word').onclick = function () {
        setGame.addNewWord()
    }
    // Add a new word by pressing the enterkey
    document.querySelector('#new-word').onkeydown = function () {
        
        if (event.code === 'Enter') setGame.addNewWord()
    }

    //Set Game deficulty
    document.querySelector('#select-deficulty').onchange =
        () => setGame.setDeficulty()

    document.querySelector('.toggle-body').onclick = () => setGame.theme()

    class TabsNavigation {
        constructor() {
            this.menu = document.querySelector('#game-menu')
            this.game = document.querySelector('#game')
            this.fail = document.querySelector('#game-over')
            this.checkScore = document.querySelector('.check-highscore')
            this.winGame = document.querySelector('.beating-highscore')
            this.settings = document.querySelector('.game-setting')
            this.about = document.querySelector('.about-section')
        }

        log() {
            return this.settings
        }

        closeParent() {
            event.target.parentElement.parentElement.classList.remove('active')
            this.menu.style.display = 'flex'
            //console.log(event.target.parentElement.parentElement)
        }

        open() {

        }

    }

    Object.setPrototypeOf(TabsNavigation.prototype, setGame)
    const tabs = new TabsNavigation()

    //console.log(tabs.log())

    //all back button to home tab
    document.querySelectorAll('.back-home').forEach(node => {
        node.onclick = () => tabs.closeParent()
        setGame.start = true
    })

    //open highscore tab 
    document.querySelector('#check_highscore').onclick = () =>
        tabs.checkScore.classList.add('active')

    //open settings tab
    document.querySelector('#open_settings').onclick = () =>
        tabs.settings.classList.add('active')

    //open about tab
    document.querySelector('#open_about').onclick = () =>
        tabs.about.classList.toggle('active')


    setGame.getLocalStorage()
    //setGame.startGame()
    //game starts when you focus on the input fill
    inputWord.onfocus = () => setGame.inputingWord()
    //Execute the inputWord() method on ever click 
    inputWord.oninput = () => setGame.inputingWord()
    //update the Score Data 
    setGame.updateData()
    //Start Game when the Space key is pressed
    /* window.onkeypress = () => setGame.spaceAction() */
    //sets the replay buttons
    document.querySelectorAll('#replay').forEach(node => node.onclick = () => setGame.clickStartBtn())
    //console.log(setGame)

    //setGame.clickStartBtn()

    //Update the DOM highScore and Social media handle
    const upDateScoreAndName = function () {
        document.querySelectorAll('.highscore-output').forEach(node => node.innerText = setGame.getLocalStorage().highScore.score)
        document.querySelectorAll('.social-handle-name').forEach(node => node.innerText = setGame.getLocalStorage().highScore.name)
    }
    upDateScoreAndName()


    //set both play and practise button


    const menuBody = document.querySelector('#game-menu')
    const countDownBody = document.querySelector('#count-down')
    //set the play and practise button 
    document.querySelectorAll('.play').forEach((node) => {
        node.onclick = () => {
            setGame.gameMode = node.getAttribute('data-game-mode')
            document.querySelector('#output-mode').innerText = setGame.gameMode
            menuBody.style.display = 'none'
            countDownBody.style.display = 'flex'
            setGame.reset()
            setGame.updateData()
            setGame.setTimeOut()
        }
    })

    let closePop = function () {
        document.querySelector('.beating-highscore ').classList.remove('active')
        //console.log(document.querySelector('.beating-highscore'))
        setGame.updateHighScore()
    }

    document.querySelector('.close-pop').onclick = () => {
        closePop()
        document.querySelector('#game-over').classList.add('active')
    }
    document.querySelector('.save-pop').onclick = () => {
        setGame.saveHighScore()
        setGame.updateHighScore()
        closePop()
        //console.log('close pop')
        document.querySelector('.check-highscore').classList.add('active')

    }

    //Set to Default Button
    const setToDefaultBtn = document.querySelector('#default')
    setToDefaultBtn.onclick = function () {
        const stored = defaultValue
        window.localStorage.clear('customeValue')
        window.localStorage.setItem('customeValue', JSON.stringify(stored))
        document.querySelector('.toggle-body').classList.remove('active')
        document.querySelector('#word-log').innerText = 'back to default'
        setGame.getLocalStorage()
        loadedSetting()
    }

    const yearOutput = document.querySelectorAll('.year-out');

    yearOutput.forEach(node => node.innerText = new Date().getFullYear())

    document.querySelectorAll('*').forEach(node => { // Stop elements from being draggable
        node.setAttribute('draggable', false)
    })

console.log(JSON.parse(window.localStorage.getItem('customeValue')))
})()
