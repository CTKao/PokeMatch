var row = 4;
var column = 4;
var newTurn = true;
var firstCardSuit = -1;
var index1 = -1;
var index2 = -1;
/* 個人紀錄 */
var wrongCount = 0;
var comboTime = 0;
var combo = true;
var higestCombo = 0;
var correct = 0;
var hintTime = -1;
/* 計時 */
var time = 0;

function set(rowNum,columnNum,suitNum) {
	document.getElementById("game").innerHTML = "";
	/* 設定row column */
	if (rowNum == "" || columnNum == ""){
		row = 4; column = 4;
	}
	else if (rowNum * columnNum % 2 == 1){
		alert("總共" + rowNum * columnNum + "張牌\n這樣是無法配對的唷~");	// 總牌數為奇數不可玩
		row = 4; column = 4;
	}
	else{
		row = rowNum; column = columnNum;
	}
	/* 判斷花色數 */
	var total = row * column;	// 總牌數
	var idealSuit = total / 2;	// 理論花色數
	if (suitNum == "")
		suit = idealSuit;
	else if (suitNum > idealSuit){
		document.getElementById("suit").value = idealSuit;
		suit = idealSuit;
		alert("別鬧了大大\n這樣是無法配對der~");
		return;
	}
	else if (suitNum > 8){
		document.getElementById("suit").value = idealSuit;
		suit = 8;
		alert("說好8種花色就是8種!!!");
		return;
	}
	else
		suit = suitNum;
	/* 依花色數做牌組 */
	deck = new Array();
	for (i=0; i<idealSuit; i++)
		deck[i] = i % suit;
	deck = deck.concat(deck);	// 陣列對稱才能完全配對
	/* 洗牌 */
	for (i=0; i<total; i++){
		var index = Math.floor(Math.random() * suit);
		var temp = deck[i];
		deck[i] = deck[index];
		deck[index] = temp;
	}
	/* 建立遊戲 */
	var tableSize = document.createElement('table');
	var tableText = "";
	var index = 0;
	for (var x=0; x<row; x++){
		tableText += "<tr>";
		for (var y=0; y<column; y++){
			tableText += "<td><div id='card" + index + "' class='card' onClick='match(" + index + ")'>";
			tableText += "<div id='f" + index + "' class='front'>";
			tableText += "<img src='pics/matchGame/cover.png' draggable='false'></div>";
			tableText += "<div id='b" + index + "' class='back'>";
			tableText += "<img src='pics/matchGame/match" + deck[index] + ".png' draggable='false'></div>";
			tableText += "</div></td>";
			index++;
		}
		tableText += "</tr>";
	}
	tableSize.innerHTML = tableText;
	document.getElementById("game").appendChild(tableSize);
}

function status(){
	switch (document.getElementById("Status").value){
		case ' 暫 停 ':
			clearInterval(gameTimer);
			document.getElementById("Status").value = "繼續遊戲";
			document.getElementById("pause").style.visibility = "visible";
			break;
		case ' 開 始 ':
		case '再玩一次':
			set(document.getElementById("row").value,document.getElementById("column").value,document.getElementById("suit").value);
			hint();
		case '繼續遊戲':
			/* 計時 */
			document.getElementsByTagName("p")[1].innerHTML = "遊戲已進行 " + time + " 秒";
			gameTimer = setInterval("timing()", 1000);
			document.getElementById("Status").value = " 暫 停 ";
			document.getElementById("pause").style.visibility = "hidden";
			break;
	}
}

function timing(){
	/* 遊戲結束 */
	if (correct == row * column / 2){
		clearInterval(gameTimer);
		document.getElementsByTagName("p")[1].innerHTML = "遊戲結束<br>共花費 " + time + " 秒";
		document.getElementsByTagName("p")[2].innerHTML = "本次遊戲";
		document.getElementsByTagName("p")[3].innerHTML = "最高Combo " + higestCombo + " 次";
		document.getElementsByTagName("p")[5].innerHTML = "使用提示 " + hintTime + " 次";
		document.getElementById("Status").value = "再玩一次";
		wrongCount = 0;
		comboTime = 0;
		combo = true;
		higestCombo = 0;
		correct = 0;
		time = 0;
	}
	/* 計時 */
	else
		document.getElementsByTagName("p")[1].innerHTML = "遊戲已進行 " + ++time + " 秒";
}

function hint(){
	for (var index=0; index<row*column; index++){
		if (!document.getElementById("f" + index))
			continue;
		flip(index,"forward");
	}
	var hintTimer = setTimeout(function(){
		for (var index=0; index<row*column; index++){
			if (!document.getElementById("f" + index))
				continue;
			flip(index,"backward");
		}
	},1000);
	hintTime++;
}

function match(index){
	/* 答錯等蓋牌再玩 or 按已經翻開的第一張牌不會反應 */
	if ((firstCardSuit == -1) && (!newTurn) || (index == index1)){
		return;
	}
	
	flip(index,"forward");
	
	/* 第一張牌 */
	if (newTurn){
		firstCardSuit = deck[index];
		index1 = index;
		newTurn = false;
	}
	/* 配對成功 */
	else if ((deck[index] == firstCardSuit) && (index != index1)){
		index2 = index;
		document.getElementById("card" + index1).innerHTML = "<img class='matched' src='pics/matchGame/match" + deck[index] + ".png'>";
		document.getElementById("card" + index2).innerHTML = "<img class='matched' src='pics/matchGame/match" + deck[index] + ".png'>";
		correct++;
		firstCardSuit = -1;
		newTurn = true;
		/* 計算combo */
		if (combo){
			document.getElementsByTagName("p")[3].innerHTML = "Combo " + ++comboTime + " 次";
			if (comboTime > higestCombo)
				higestCombo = comboTime;
		}
		else
			comboTime = 0;
		combo = true;
	}
	/* 配對失敗 */
	else{
		index2 = index;
		delayTimer = setTimeout("Wrong()", 1000);
		firstCardSuit = -1;
		document.getElementsByTagName("p")[4].innerHTML = "答錯 " + ++wrongCount + " 次";
	}
}

function Wrong(){
	clearTimeout(delayTimer);
	flip(index1,"backward");
	flip(index2,"backward");
	newTurn = true;
	index1 = -1;
	index2 = -1;
	combo = false;
}

function flip(index,type){
	switch (type){
		case 'forward':
			document.getElementById("f" + index).style.transform = "rotateY(180deg)";
			document.getElementById("b" + index).style.transform = "rotateY(0deg)";
			break;
		case 'backward':
			document.getElementById("b" + index).style.transform = "rotateY(180deg)";
			document.getElementById("f" + index).style.transform = "rotateY(0deg)";
			break;
	}
}