// 로그인 임시 방편
let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

// SSE 연결
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if(data.sender === username) {
        // 파란색(오른쪽)
        initMyMessage(data);
    } else {
        // 회색(왼쪽)
        initYourMessage(data);
    }
};

// 파란박스 생성
function getSendMsgBox(data) {

	let md = data.createdAt.substring(5, 10)
	let tm = data.createdAt.substring(11, 16)
	convertTime = tm + " | " + md

	return `<div class="sent_msg">
        <p>${data.msg}</p>
        <span class="time_date"> ${convertTime} / <b>${data.sender}</b> </span>
    </div>`;
}


// 회색박스 생성
function getReceiveMsgBox(data) {

	let md = data.createdAt.substring(5, 10)
	let tm = data.createdAt.substring(11, 16)
	convertTime = tm + " | " + md

	return `<div class="received_withd_msg">
        <p>${data.msg}</p>
        <span class="time_date"> ${convertTime} / <b>${data.sender}</b> </span>
    </div>`;
}

// DB insert후 자동으로 데이터가 흘러 들어옴(SSE)
// 파란박스 초기화
function initMyMessage(data) {
    let chatBox = document.querySelector("#chat-box");

    let sendBox = document.createElement("div");
    sendBox.className = "outgoing_msg";

    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
}

// 회색박스 초기화
function initYourMessage(data) {
    let chatBox = document.querySelector("#chat-box");

    let receivedBox = document.createElement("div");
    receivedBox.className = "received_msg";

    receivedBox.innerHTML = getReceiveMsgBox(data);
    chatBox.append(receivedBox);
}

// Ajax 채팅 메시지 전송
async function addMessage() {
    let msgInput = document.querySelector("#chat-outgoing-msg");

    let chat = {
        sender: username,
        roomNum: roomNum,
        msg: msgInput.value
    };

    fetch("http://localhost:8080/chat", {
        method: "post",
        body: JSON.stringify(chat),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    });

    msgInput.value = "";
}

// 버튼 클릭시 메시지 전송
document.querySelector("#chat-send").addEventListener("click", () => {
    addMessage();
});

// 엔터 누를시 메시지 전송
document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    if(e.keyCode === 13) {
        addMessage();
    }
});