const nameInput = document.getElementById("name");
const timeInput = document.getElementById("time");
const routineAdd = document.getElementById("add");

const deleteR = document.getElementById("deleteBtn");
const routineSet = document.getElementById("set");

const routineStart = document.getElementById("startBtn");
const routineStop = document.getElementById("stopBtn");

const countSet = document.getElementById("setNum");
const table = document.getElementById("routineList");
const trs = document.getElementsByTagName("tr");

const timeSec = document.getElementById("sec");
const timeSecPoint = document.getElementById("secPoint");

let routine = [];
let duringRoutineList;
let duringRoutineTimer;
let routineState = false;
let endSound1 = new Audio('ring.mp3');
let endSound2 = new Audio('ending.mp3');

//추가
routineAdd.addEventListener("click", ()=>{
    const newTimerText = nameInput.value.trim();
    const newTimerTime = parseInt(timeInput.value.trim());

    if (newTimerText && newTimerTime) {         //누락된 정보가 없는지 검사
        routine.push({ text: newTimerText, time: newTimerTime });   //정보를 객체로 삽입
        const newRoutine = table.insertRow();
        const newName = newRoutine.insertCell(0);
        const newTime = newRoutine.insertCell(1);

        newRoutine.className = "table-primary";     //템플릿을 적용되는 클래스 이름 부여
        newName.innerText = newTimerText;
        newTime.innerText = newTimerTime;

        nameInput.value = "";       //입력창 초기화
        timeInput.value = "";
    }
});

//삭제
deleteR.addEventListener("click", ()=>{
    if(routine.length == 0){    //목차가 지워지는 걸 방지(행개수가 아닌 루틴개수)
        alert("생성된 루틴이 없습니다.");
    }
    else if(routineState){      //실행중 함수가 실행되는 것을 방지
        alert("실행중인 루틴은 삭제할 수 없습니다.");
    }
    else{
        table.deleteRow(routine.length);
        routine.pop();
    }
});

//시작
routineStart.addEventListener("click", ()=>{
    if(routine.length == 0){
        alert("생성된 루틴이 없습니다.")
        return;
    }

    let repeat = parseInt(routineSet.value.trim());
    let cnt = 1;
    let currentTimerIndex = 0;
    let currentTime = 0;
    let currentSec, currentSecP = 0;
    
    routineState = true;

    const nextTimer = () => {
        if(currentTimerIndex == routine.length)     //1개 세트가 끝날때
        {   
            for(let i = 0; i < routine.length; i++){    //테이블 색 초기화
                trs[i + 1].className = "table-primary";
            }
            if(--repeat == 0){    //남은 세트가 없을때
                routineState = false
                endSound2.play();
                return;
            }
            else{   //남은 세트가 있을때
                currentTimerIndex = 0;
                cnt++;
            }
        }

        countSet.innerHTML = cnt+"번 세트";

        //루틴 색 변경
        trs[currentTimerIndex + 1].className = "table-success";
        if (currentTimerIndex > 0) {
            trs[currentTimerIndex].className = "table-dark";
        }

        //타이머 시간 표시
        currentTime = routine[currentTimerIndex].time * 100 - 1;
        duringRoutineTimer = setInterval(() => {
            currentSec = Math.floor(currentTime/100);
            currentSecP = currentTime % 100;
            timeSec.innerHTML = currentSec < 100 ? (currentSec < 10 ? '00'+currentSec : '0'+currentSec) : currentSec;
            timeSecPoint.innerHTML = currentSecP < 10 ? '0'+currentSecP : currentSecP;
            currentTime--;
        }, 10);
        

        duringRoutineList = setTimeout(() => {
            clearInterval(duringRoutineTimer);
            currentTimerIndex++;
            nextTimer();        
            if(repeat != 0){
                endSound1.play();
            }
        }, routine[currentTimerIndex].time * 1000);
    };

    nextTimer();
});


//정지
routineStop.addEventListener("click", ()=>{
    if(routineState){
        clearTimeout(duringRoutineList);
        clearInterval(duringRoutineTimer);
        routineState = false;

        alert("루틴이 중지되었습니다.");

        for(let i = 0; i < routine.length; i++){
            trs[i + 1].className = "table-primary";
            timeSec.innerText="000";
            timeSecPoint.innerText="00";
            countSet.innerText = "0번 세트";
        }
    }
});